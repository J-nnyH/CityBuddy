import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GbfsModule } from '../gbfs/gbfs.module';

@Module({
  imports: [GbfsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
