export interface Intent {
  readonly id: number;
  intent: string;
  description: string | null;
  inModel: boolean;
  modifiedAt: string;
  examplesCount: number | null;
}
