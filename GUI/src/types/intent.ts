export interface Intent {
  id: string;
  description: string | null;
  inModel: boolean;
  modifiedAt: string;
  examplesCount: number | null;
  isForService?: boolean;
  examples: string[];
  serviceId: string;
  isCommon?: boolean;
}

export type IntentId = Pick<Intent, 'id'>;
