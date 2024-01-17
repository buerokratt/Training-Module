export interface Form {
  readonly id: number;
  name: string;
  response: string;
  required_slots: [{
    slot_name: string,
    question: string
  }];
  ignored_intents: string[];
}

export interface FormCreateDTO extends Omit<Form, 'id'> {
}

export interface FormEditDTO extends Omit<Form, 'id'> {
}
