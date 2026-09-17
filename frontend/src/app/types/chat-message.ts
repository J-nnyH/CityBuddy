export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatRequestBody = {
  messages: ChatMessage[];
};

export type MapStation = {
  stationId: string;
  name: string;
  bikesAvailable: number;
  docksAvailable: number;
  latitude: number;
  longitude: number;
};

export type ChatResponse = {
  role: 'assistant';
  content: string;
  stations: MapStation[];
};
