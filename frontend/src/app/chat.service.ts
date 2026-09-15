import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatMessage, ChatRequestBody, ChatResponse } from './types/chat-message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/chat';

  sendMessage(messages: ChatMessage[]) {
    const payload: ChatRequestBody = { messages };
    return this.http.post<ChatResponse>(this.apiUrl, payload);
  }
}
