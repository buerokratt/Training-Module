export interface Entity {
  readonly id: number;
  name: string;
  relatedIntent: string | null;
}
