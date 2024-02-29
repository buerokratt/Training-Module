export interface Model {
  readonly id: number;
  name: string;
  lastTrained: string;
  state: ModelStateType;
}

export type ModelStateType = 'DEPLOYED' | 'TRAINED' | 'FAILED' | 'REMOVED';

export interface UpdateModelDTO extends Omit<Model, 'id' | 'lastTrained'> {
}
