import { Intent } from './intent';

export type IntentWithExamplesCount = Pick<Intent, 'id' | 'examplesCount' | 'inModel' | 'isCommon' | 'modifiedAt'>;
