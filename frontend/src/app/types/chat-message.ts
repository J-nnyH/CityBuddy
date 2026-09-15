export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatRequestBody = {
  messages: ChatMessage[];
};

export type ChatResponse = {
  role: 'assistant';
  content: string;
};
