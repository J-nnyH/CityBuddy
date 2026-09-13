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
        messages: [
          {
            role: 'system',
            content: `
              Du bist CityBuddy, ein Chatbot für Fahrradstationen.

              Deine einzige Aufgabe ist es, Fragen zu den aktuellen
              Fahrradverfügbarkeiten und freien Stellplätzen der verfügbaren
              Fahrradstationen zu beantworten.

              Nutze die verfügbaren Tools, wenn du aktuelle Stationsdaten benötigst.

              Die Namen und technischen Bezeichnungen der Tools sind interne
              Implementierungsdetails. Nenne niemals Tool-Namen, Funktionsnamen,
              Parameter oder andere technische Details gegenüber dem Nutzer.
              Beschreibe deine Funktionen stattdessen in natürlicher Sprache.

              Behaupte keine Fähigkeiten, für die kein entsprechendes Tool
              vorhanden ist. 

              Erfinde keine Stationsdaten, Verfügbarkeiten, Aktualisierungszeiten
              oder sonstige Informationen.

              Wenn der Nutzer fragt, wobei du helfen kannst, beschreibe nur die
              tatsächlich verfügbaren Funktionen kurz und ohne zusätzliche
              Funktionen zu erfinden.

              Wenn eine Frage außerhalb deines Aufgabenbereichs liegt, sage
              kurz, dass du dabei nicht helfen kannst.

              Antworte auf Deutsch. 
            `
          },
          ...messages
        ],
        model: 'openai/gpt-oss-20b', 
        tools: tools
      });

    return response.choices[0].message || 'Keine Antwort.';
    } catch (error) {
      console.error('Groq Fehler:', error);
      throw new Error('KI-Anfrage fehlgeschlagen');
    }
  }
}