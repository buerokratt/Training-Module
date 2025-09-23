export interface Metrics {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
  confused_with?: Record<string, number>;
}

export interface IntentsReportResult {
  [intentName: string]: Metrics | number;
  accuracy: number;
  'macro avg': Metrics;
  'weighted avg': Metrics;
  'micro avg': Metrics;
}

interface EvaluationResult {
  report: IntentsReportResult;
  precision: number;
  f1_score: number;
  errors: {
    text: string;
    intent: string;
    intent_prediction: {
      name: string;
      confidence: number;
    };
  };
}

export interface IntentsReport {
  intent_evaluation: EvaluationResult;
  entity_evaluation: EvaluationResult;
  response_selection_evaluation: EvaluationResult;
}

export type IntentReport = Metrics & { intent: string };
