type RuleStep = {
  intent?: string;
  action?: string;
  active_loop?: string | null;
  slot_was_set?:
    | Array<Record<string, any>>
    | {
        requested_slot: string | null;
        slot?: string;
      };
  entities?: Array<{
    [key: string]: string;
  }>;
};

export interface Rule {
  id: string;
  steps: RuleStep | RuleStep[];
  conversation_start?: string;
  wait_for_user_input?: string;
}

export interface RuleDTO extends Omit<Rule, 'id'> {
  rule: string;
}
