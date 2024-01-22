export interface Form {
  readonly id: number;
  form: {
    name: string;
    required_slots: string[];
    ignored_intents: string[],
  },
  responses: {
    response: string,
    questions: [{
      slot_name: string,
      question: string
    }];
  }
}

export interface FormCreateDTO extends Omit<Form, 'id'> {
}

export interface FormEditDTO extends Omit<Form, 'id'> {
}
