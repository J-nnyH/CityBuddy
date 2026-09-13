import { Injectable } from '@nestjs/common';
import { GbfsService} from '../gbfs/gbfs.service'
import { GroqService } from '../groq/groq.service';
import Groq from 'groq-sdk';

@Injectable()
export class ChatService {
  constructor(private readonly gbfsService: GbfsService, 
    private readonly groqService: GroqService) {}
    
async chat(
  messages: Groq.Chat.Completions.ChatCompletionMessageParam[],
) {
  let response = await this.groqService.generateText(messages);

  let toolRounds = 0;

  //Begrenzung der Tool Aufrufe 
  const MAX_TOOL_ROUNDS = 5;
  const MAX_TOOL_CALLS_PER_ROUND = 10;

  while (
    response.tool_calls?.length &&
    toolRounds < MAX_TOOL_ROUNDS
  ) {
    toolRounds++;

    if (response.tool_calls.length > MAX_TOOL_CALLS_PER_ROUND) {
      throw new Error('Zu viele Tool-Aufrufe in einer Runde');
    }

    messages.push(response);

    for (const toolCall of response.tool_calls) {
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      let toolResult;

      if (functionName === 'getStationsWithBikes') {
        toolResult = await this.gbfsService.getStationsWithBikes(
          args.minNumOfBikes,
        );
      } else if (functionName === 'getStationsWithFreeDocks') {
        toolResult = await this.gbfsService.getStationsWithFreeDocks(
          args.minNumOfDocks,
        );
      } else if (functionName === 'getStationStatus') {
        toolResult = await this.gbfsService.getStationStatus(
          args.stationName,
        );
      } else {
        toolResult = {
          error: 'Unbekanntes Tool',
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

  return response;
}
}
