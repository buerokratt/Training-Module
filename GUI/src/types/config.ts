export interface Policy {
  readonly id: number;
  name: string;
  active: boolean;
  priority: number;
  epochs?: number;
  maxHistory?: number;
  checkForContradictions?: boolean;
  coreFallbackThreshold?: number;
}

export interface Config {
  recipe: string;
  language: string;
  pipeline: {
    epochs: number;
    randomSeed: number;
    threshold: number;
  };
  policies: Policy[];
}
