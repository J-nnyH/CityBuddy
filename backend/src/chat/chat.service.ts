import { Injectable } from '@nestjs/common';
import { GbfsService} from '../gbfs/gbfs.service'
import { GroqService } from '../groq/groq.service';
import Groq from 'groq-sdk';

@Injectable()
export class ChatService {
  constructor(private readonly gbfsService: GbfsService, 
    private readonly groqService: GroqService) {}
    
  async chat(messages: Groq.Chat.Completions.ChatCompletionMessageParam[]) {
    
    const response = await this.groqService.generateText(messages)

    //falls kein tool gewählt wird, direkt llm antwort responden
    if(!response.tool_calls?.length){
      return response
    }

    const functionName = response.tool_calls?.[0].function.name;

    const argumentsString = response.tool_calls?.[0].function.arguments;
    const args = JSON.parse(argumentsString!);


    if (functionName === 'getStationsWithBikes') {
      const stationsWithBikes = await this.gbfsService.getStationsWithBikes(
        args.minNumOfBikes,
      );
      messages.push(response);

      messages.push({
      role: 'tool',
      tool_call_id: response.tool_calls![0].id,
      content: JSON.stringify(stationsWithBikes),
      });

      const finalResponse = await this.groqService.generateText(messages);

      return finalResponse;
    } else return {
    role: 'assistant',
    content: 'Ich konnte dafür gerade kein passendes Tool finden.'
  };
  }
}
