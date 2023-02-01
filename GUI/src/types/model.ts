export interface Model {
  readonly id: number;
  name: string;
  lastTrained: string;
  active: boolean;
}

export interface UpdateModelDTO extends Omit<Model, 'id' | 'lastTrained'> {
}
