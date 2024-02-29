import { ResponseData } from "./response";

export interface Rule {
  id: string;
  steps: string | string[];
}

export interface Rules {
  response: Rule[];
}

export interface RuleDTO extends Omit<Rule, 'id'> {
  rule: string;
}
