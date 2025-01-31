import { IntentWithExamplesCount } from 'types/intentWithExamplesCount';

export const compareInModel = (a: IntentWithExamplesCount, b: IntentWithExamplesCount) => {
  if (a.inModel === b.inModel) return 0;
  if (a.inModel) return -1;
  return 1;
};

export const compareInModelReversed = (a: IntentWithExamplesCount, b: IntentWithExamplesCount) => {
  return -1 * compareInModel(a, b);
};
