export interface Form {
  readonly id: number;
  form_name: string;
  response: string;
  utter_ask: string;
  slots: string[];
  ingored_intents: string[];
}

export interface FormCreateDTO extends Omit<Form, 'id'> {
}

export interface FormEditDTO extends Omit<Form, 'id'> {
}
