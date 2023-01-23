export interface Policy {
  readonly id: number;
  name: string;
  enabled: boolean;
  priority: number;
  epochs?: number;
  max_history?: number;
  core_fallback_threshold?: number;
  enable_fallback_prediction?: boolean;
}

export interface PipelineComponent {
  name: string;
  enabled: boolean;
  analyzer?: string;
  min_ngram?: number;
  max_ngram?: number;
  entity_recognition?: boolean;
  epochs?: number;
  random_seed?: number;
  case_sensitive?: boolean;
  use_regexes?: boolean;
  threshold?: number;
}

export interface Config {
  recipe: string;
  language: string;
  pipeline: PipelineComponent[];
  policies: Policy[];
}
