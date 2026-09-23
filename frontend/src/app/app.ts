import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
  signal,
  HostListener,
} from '@angular/core';
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

  isScrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 40);
  }

  @ViewChildren('messageElement')
  messageElements!: QueryList<ElementRef<HTMLDivElement>>;

  messages = signal<ChatMessage[]>([]);

  isLoading = signal(false);

  reloadPage(): void {
    window.location.reload();
  }

  stations = signal<MapStation[]>([]);

  suggestionPrompts: string[] = [];

  constructor() {
    const stations = ['Butzweiler Hof', 'Fühlinger See', 'Friesenplatz', 'Brüsseler Platz'];

    const station = stations[Math.floor(Math.random() * stations.length)];

    this.suggestionPrompts = [
      'Wo finde ich freie Stellplätze?',
      'Gibt es in Köln Stationen mit 2 Fahrrädern?',
      `Wie viele Fahrräder sind an der Station ${station}?`,
    ];
  }

  autoResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 200 ? 'auto' : 'hidden';
  }

  handleEnter(event: Event, textarea: HTMLTextAreaElement): void {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.shiftKey) {
      return;
    }

    event.preventDefault();
    this.sendFromInput(textarea);
  }

  sendFromInput(textarea: HTMLTextAreaElement): void {
    const message = textarea.value.trim();

    if (!message || this.isLoading()) {
      return;
    }

    this.chatRequest(message);

    textarea.value = '';
    textarea.style.height = 'auto';
    textarea.style.overflowY = 'hidden';
  }

  chatRequest(message: string): void {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || this.isLoading()) {
      return;
    }

    this.messages.update((prev) => [...prev, { role: 'user', content: trimmedMessage }]);

    this.isLoading.set(true);

    setTimeout(() => {
      const userMessage = this.messageElements.last;

      userMessage?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

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
