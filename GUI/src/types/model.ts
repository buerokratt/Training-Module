export interface Model {
  readonly id: number;
  name: string;
  description: string;
  lastTrained: string;
  state: ModelStateType;
  versionNumber: string;
}

export type ModelStateType = 'DEPLOYED' | 'ACTIVATING' | 'READY' | 'Failed' | 'DELETED';

export interface UpdateModelDTO extends Pick<Model, 'versionNumber' | 'name'> {}
