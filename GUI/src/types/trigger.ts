export interface Trigger {
  readonly id: number;
  intent: string;
  service: string;
  serviceName: string;
  authorRole: string;
  requestedAt: string;
  status: string;
}
