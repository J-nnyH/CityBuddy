import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './chat.service';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  imports: [RouterOutlet, MarkdownComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private chatService = inject(ChatService)
  messages = signal(
    [{role:'assistant', content:'Hi! Was kann ich für dich tun?'}
    ]
  )
  isLoading = signal(false)
  chatRequest(message: string){
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    this.messages.update(prev=> [...prev, {role:"user", content: trimmedMessage}])
    this.isLoading.set(true)

    this.chatService.sendMessage(this.messages()).subscribe({
      next: response => {
        this.messages.update(prev=> [...prev, {
          role: response.role, 
          content:response.content}]);
        this.isLoading.set(false)
        },
      error: error => {
        console.error(error)
        this.messages.update(prev => [...prev, {
          role: "assistant", 
          content: 'Die Anfrage konnte nicht verarbeitet werden.' }])
        this.isLoading.set(false) 
      }

    }
  ) 
  }
}
