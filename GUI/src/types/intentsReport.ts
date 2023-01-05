export interface IntentsReportResult {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
  confused_with?: Record<string, number>;
}

export interface IntentsReport extends Record<string, IntentsReportResult> {
}
