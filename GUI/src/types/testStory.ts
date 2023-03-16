export interface TestStory {
  readonly id: number;
  story: string;
  hasTest: boolean;
  activeStory: boolean;
  steps: {
    user: string;
    intent: string;
    action: string;
  };
}
