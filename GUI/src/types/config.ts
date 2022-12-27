export interface Policy {
  name: string;
  active: boolean;
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
