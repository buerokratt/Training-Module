export interface Conversation {
  readonly id: number;
  startTime: string;
  endTime: string;
  name: string;
  label: string;
  comment: string | null;
}
