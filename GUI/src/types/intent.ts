export interface Intent {
  id: string;
  intent: string;
  description: string | null;
  inModel: boolean;
  modifiedAt: string;
  examplesCount: number | null;
  examples: string[];
}
