export interface TestStory {
  readonly id: number;
  story: string;
  steps: {
    user: string;
    intent: string;
    action: string;
  };
}
