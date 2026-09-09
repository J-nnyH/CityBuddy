import { Injectable } from '@nestjs/common';
import { GbfsService} from '../gbfs/gbfs.service'
import { GroqService } from '../groq/groq.service';
import Groq from 'groq-sdk';

@Injectable()
export class ChatService {
  constructor(private readonly gbfsService: GbfsService, 
    private readonly groqService: GroqService) {}
    
  async chat() {

    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [{
    role: 'system',
    content: 'Du bist ein hilfreicher KI-Assistent',
    },{
    role: 'user',
    content: 'Wo gibt es noch ein Fahrrad?',
    }]
    
    const toolCall = await this.groqService.generateText(messages)
    console.log(toolCall);

    const functionName = toolCall.tool_calls?.[0].function.name;

    const argumentsString = toolCall.tool_calls?.[0].function.arguments;
    const args = JSON.parse(argumentsString!);

    console.log(functionName, args.minNumOfBikes);

    if (functionName === 'getStationsWithBikes') {
      const stationsWithBikes = await this.gbfsService.getStationsWithBikes(
        args.minNumOfBikes,
      );
      messages.push(toolCall);

      messages.push({
      role: 'tool',
      tool_call_id: toolCall.tool_calls![0].id,
      content: JSON.stringify(stationsWithBikes),
      });
      console.log(toolCall.tool_calls![0]);

      const finalResponse = await this.groqService.generateText(messages);

      return finalResponse;
    } else return 'Kein passendes Tool gefunden'
  }
}
