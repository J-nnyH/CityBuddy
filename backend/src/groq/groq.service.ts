import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { tools } from '../tools/tools';


@Injectable()
export class GroqService {
  private groq: Groq;
 
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  async generateText(messages: any[]){
    try {
      const response = await this.groq.chat.completions.create({
        messages,
        model: 'openai/gpt-oss-20b', 
        tools: tools
      });

      console.log(JSON.stringify(response.choices[0].message, null, 2));

    return response.choices[0].message || 'Keine Antwort.';
      // return response.choices?.[0]?.message?.content || 'Keine Antwort.';
    } catch (error) {
      console.error('Groq Fehler:', error);
      throw new Error('KI-Anfrage fehlgeschlagen');
    }
  }
}