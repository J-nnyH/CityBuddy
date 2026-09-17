import { Component, signal, inject } from '@angular/core';
import { ChatService } from './chat.service';
import { MarkdownComponent } from 'ngx-markdown';
import { ChatMessage, MapStation } from './types/chat-message';
import { MapComponent } from './map/map';

@Component({
  imports: [MarkdownComponent, MapComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly chatService = inject(ChatService);

  get suggestionPrompts(): string[] {
    const stations = ['Butzweiler Hof', 'Fühlinger See', 'Friesenplatz', 'Brüsseler Platz'];
    const station = stations[Math.floor(Math.random() * stations.length)];
    return [
      'Wo finde ich freie Stellpätze?',
      'Gibt es in Köln Stationen mit 2 Fahrrädern?',
      `Wie viele Fahrräder sind an der Station ${station}?`,
    ];
  }

  stations = signal<MapStation[]>([]);

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
        this.stations.set(response.stations);

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
