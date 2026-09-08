import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getStationWithBikes() {
    return this.chatService.chat();
  }
}
