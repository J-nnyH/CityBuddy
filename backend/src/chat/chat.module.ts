import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GbfsModule } from '../gbfs/gbfs.module';
import { GroqModule } from '../groq/groq.module';

@Module({
  imports: [GbfsModule, GroqModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
