import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import Groq from 'groq-sdk';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  chat(
    @Body()
    body: {
      messages: Groq.Chat.Completions.ChatCompletionMessageParam[];
    },
  ) {
    return this.chatService.chat(body.messages);
  }
}
