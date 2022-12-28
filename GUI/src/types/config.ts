export interface Policy {
  readonly id: number;
  name: string;
  active: boolean;
  randomSeed: number;
  epochs: number;
  constrainSimilarities: boolean;
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
