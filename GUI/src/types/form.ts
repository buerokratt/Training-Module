export interface Form {
  readonly id: number;
  form: string;
}

export interface FormCreateDTO extends Omit<Form, 'id'> {
}

export interface FormEditDTO extends Omit<Form, 'id'> {
}
