import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  messages = signal(
    [{role:'buddy', message:'Hi! Was kann ich für dich tun?'}
    ]
  )

  chatRequest(message: string){
    this.messages.update(prev=> [...prev, {role:"user", message: message}])
  }
}
