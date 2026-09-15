import { Component, signal, inject } from '@angular/core';
import { ChatService } from './chat.service';
import { MarkdownComponent } from 'ngx-markdown';
import { ChatMessage } from './types/chat-message';

@Component({
  imports: [MarkdownComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly chatService = inject(ChatService);

  readonly suggestionPrompts = [
    'Wo finde ich freie Stellpätze?',
    'Gibt es in Köln Stationen mit 5 freien Plätzen?',
    'Wieviele Fahrräder sind am Butzweiler Hof?',
  ];

  messages = signal<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! Was kann ich für dich tun?' },
  ]);

  isLoading = signal(false);

  chatRequest(message: string): void {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || this.isLoading()) {
      return;
    }

    this.messages.update((prev) => [...prev, { role: 'user', content: trimmedMessage }]);
    this.isLoading.set(true);

    this.chatService.sendMessage(this.messages()).subscribe({
      next: (response) => {
        this.messages.update((prev) => [
          ...prev,
          { role: response.role, content: response.content },
        ]);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        const fallbackMessage =
          error?.error?.message ??
          'Die Anfrage konnte nicht verarbeitet werden. Bitte versuche es noch einmal.';

        this.messages.update((prev) => [...prev, { role: 'assistant', content: fallbackMessage }]);
        this.isLoading.set(false);
      },
    });
  }
}
