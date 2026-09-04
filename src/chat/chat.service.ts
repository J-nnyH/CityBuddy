import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  chat() {
    return 'Chat ist bereit.';
  }
}
