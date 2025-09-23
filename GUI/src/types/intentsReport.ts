export interface IntentMetrics {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
  confused_with?: Record<string, number>;
}

export interface SummaryMetrics {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
}

export interface IntentsReportResult {
  [intentName: string]: IntentMetrics | number | SummaryMetrics;
  accuracy: number;
  'macro avg': SummaryMetrics;
  'weighted avg': SummaryMetrics;
  'micro avg': SummaryMetrics;
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

export type IntentReport = IntentMetrics & { intent: string };
