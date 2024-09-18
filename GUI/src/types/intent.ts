export interface Intent {
  id: string;
  description: string | null;
  inModel: boolean;
  modifiedAt: string;
  examplesCount: number | null;
  examples: string[];
  serviceId: string;
  isCommon?: boolean;
}
