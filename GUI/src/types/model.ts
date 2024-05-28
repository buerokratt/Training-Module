export interface Model {
  readonly id: number;
  name: string;
  lastTrained: string;
  state: ModelStateType;
  versionNumber: string;
}

export type ModelStateType = 'DEPLOYED' | 'READY' | 'Failed' | 'DELETED';

export interface UpdateModelDTO extends Pick<Model, 'versionNumber'> {}
