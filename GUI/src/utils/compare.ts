import { Intent } from "types/intent";

export const compareInModel= (a: Intent, b: Intent) => {
  if(a.inModel === b.inModel) return 0;
  if(a.inModel) return -1;
  return 1;
}

export const compareInModelReversed= (a: Intent, b: Intent) => {
  return -1 * compareInModel(a, b);
}
