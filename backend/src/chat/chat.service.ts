import { Injectable, BadRequestException } from '@nestjs/common';
import { GbfsService } from '../gbfs/gbfs.service';
import { GroqService } from '../groq/groq.service';
import Groq from 'groq-sdk';

type ToolArgs = {
  minNumOfBikes?: number;
  minNumOfDocks?: number;
  stationName?: string;
};

@Injectable()
export class ChatService {
  constructor(
    private readonly gbfsService: GbfsService,
    private readonly groqService: GroqService,
  ) {}

  async chat(
    messages: Groq.Chat.Completions.ChatCompletionMessageParam[],
  ): Promise<Groq.Chat.Completions.ChatCompletionMessage> {
    if (!Array.isArray(messages) || 
    messages.length === 0 || 
    messages.some(
      (message) =>
        message.role !== 'user' &&
        message.role !== 'assistant'
    )){
      throw new BadRequestException('Bitte sende mindestens eine Nachricht.');
    }
    let response = await this.groqService.generateText(messages);

    let toolRounds = 0;

    //Begrenzung der Tool Aufrufe
    const MAX_TOOL_ROUNDS = 5;
    const MAX_TOOL_CALLS_PER_ROUND = 10;

    while (response.tool_calls?.length && toolRounds < MAX_TOOL_ROUNDS) {
      toolRounds++;

      if (response.tool_calls.length > MAX_TOOL_CALLS_PER_ROUND) {
        throw new Error('Zu viele Tool-Aufrufe in einer Runde');
      }

      messages.push(response);

      for (const toolCall of response.tool_calls) {
        const functionName = toolCall.function.name;
        let args: ToolArgs;
        let toolResult: unknown;

        // Ungültiges JSON soll nicht den gesamten Chat-Request abbrechen.
        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch {
          toolResult = {
            error: 'Ungültige Tool-Argumente',
          };

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult),
          });

          continue;
        }

        // Fehler bei der Tool-Ausführung sollen nicht den gesamten Chat-Request abbrechen.

        try {
          if (functionName === 'getStationsWithBikes') {
            const minNumOfBikes = args.minNumOfBikes ?? 1;
            toolResult =
              await this.gbfsService.getStationsWithBikes(minNumOfBikes);
          } else if (functionName === 'getStationsWithFreeDocks') {
            const minNumOfDocks = args.minNumOfDocks ?? 1;
            toolResult =
              await this.gbfsService.getStationsWithFreeDocks(minNumOfDocks);
          } else if (functionName === 'getStationStatus') {
            const stationName = args.stationName;
            if (!stationName) {
              toolResult = {
                error: 'Kein Stationsname angegeben.',
              };
            } else {
              toolResult = await this.gbfsService.getStationStatus(stationName);
            }
          } else {
            toolResult = {
              error: 'Unbekanntes Tool',
            };
          }
        } catch {
          toolResult = {
            error: 'Die Stationsdaten konnten nicht abgerufen werden.',
          };
        }

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }

      response = await this.groqService.generateText(messages);
    }

    if (response.tool_calls?.length) {
      throw new Error('Maximale Anzahl an Tool-Runden erreicht');
    }

    return response;
  }
}
