import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  getStationWithBikes(@Body() body:any) {
    console.log(body)
    return this.chatService.chat(body.messages);
  }
}
