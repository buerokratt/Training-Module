import api from './temp-api';
import localDevApi from './local-dev-api';
import { Intent } from 'types/intent';

export async function addIntent(newIntentData: { name: string }) {
  const { data } = await api.post('/intents/add', newIntentData);
  return data;
}

export async function editIntent(editIntentData: {oldName: string, newName: string}) {
  const { data } = await api.post(`intents/update`, editIntentData);
  return data;
}

export async function deleteIntent(deleteIntentData: { name: string }) {
  const { data } = await api.post(`intents/delete`, deleteIntentData);
  return data;
}

export async function addRemoveIntentModel(intentModelData: {name: string, inModel: boolean}) {
  const { data } = await api.post(`intents/add-remove-from-model`, intentModelData);
  return data;
}

export async function addExample(addExampleData: { intentName: string, intentExamples: string[], newExamples: string }) {
  const { data } = await api.post<{ intentName: string; example: string; }>(`intents/examples/add`, addExampleData);
  return data;
}

export async function addExampleFromHistory(intentName: string, exampleData: { example: string }) {
  const {data} = await api.post<{ intentName: string; example: string; }>(`intents/examples/add`, exampleData);
  return data;
}

export async function editExample(editExampleData: { intentName: string, oldExample: string, newExample: string }) {
  const { data } = await api.post<{ intentName: string; example: string; }>(`intents/examples/update`, editExampleData);
  return data;
}

export async function deleteExample(deleteExampleData: { intentName: string, example: string }) {
  const { data } = await api.post<{ intentName: string; example: string; }>(`intents/examples/delete`, deleteExampleData);
  return data;
}

export async function turnExampleIntoIntent(data: {
  exampleName: string;
  intentName: string;
}): Promise<void> {
  await localDevApi.post('/rasa/intents/add', {
    intent: data.exampleName,
  });
  await localDevApi.post(
    '/rasa/intents/examples/delete',
    { intent: data.intentName, example: data.exampleName }
  );
}

export async function turnIntentIntoService(
  intent: Intent
): Promise<void> {
  await localDevApi.post('/rasa/intents/turn-into-service', {
    intentName: intent.intent
  });
}
