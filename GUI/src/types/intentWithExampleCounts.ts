import { Intent } from './intent';

export type IntentWithExamplesCount = Pick<Intent, 'id' | 'examplesCount' | 'inModel' | 'isCommon' | 'modifiedAt'>;

export type IntentWithExamplesCountResponse = Pick<Intent, 'id' | 'inModel' | 'modifiedAt'> & {
  examples_count: number;
};

export type IntentsWithExamplesCountResponse = {
  response: {
    intents: IntentWithExamplesCountResponse[];
  };
};

// todo move to utils or remove
export const intentResponseToIntent = (intent: IntentWithExamplesCountResponse): IntentWithExamplesCount => ({
  ...intent,
  examplesCount: intent.examples_count,
  isCommon: intent.id.startsWith('common_'),
});
