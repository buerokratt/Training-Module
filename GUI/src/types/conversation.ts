export interface ConversationTeaser {
  readonly id: number;
  startTime: string;
  endTime: string;
  name: string;
  label: string;
  comment: string | null;
}

export interface Conversation {
  readonly id: number;
  messages: Message[];
}

export interface Message {
  name: string;
  message: string;
  sentAt: string;
}
