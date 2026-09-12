import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable ({
    providedIn: 'root'
})
export class ChatService{
    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000/chat'

    sendMessage(messages: any) {
        return this.http.post<{role: string, content: string}>(this.apiUrl, {messages})
    }
}