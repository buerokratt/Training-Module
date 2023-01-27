export interface Entity {
  readonly id: number;
  name: string;
  relatedIntents: string[] | null;
}
