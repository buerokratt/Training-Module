export interface Rule {
  id: string;
  steps: string | string[];
  conversation_start?: string;
  wait_for_user_input?: string;
}

export interface Rules {
  response: Rule[];
}

export interface RuleDTO extends Omit<Rule, 'id'> {
  rule: string;
}
