import api from './api';
import localDevApi from './local-dev-api';
import { Intent } from 'types/intent';

export async function addIntent(newIntentData: { name: string }) {
  const { data } = await api.post('intents', newIntentData);
  return data;
}

export async function editIntent(id: string | number, intentData: Omit<Partial<Intent>, 'id'>) {
  const { data } = await api.patch(`intents/${id}`, intentData);
  return data;
}

export async function deleteIntent(id: string | number) {
  const { data } = await api.delete<void>(`intents/${id}`);
  return data;
}

export async function addExample(intentId: string | number, exampleData: { example: string }) {
  const { data } = await api.post<{ id: number; example: string; }>(`intents/${intentId}/examples`, exampleData);
  return data;
}

export async function editExample(intentId: string | number, exampleData: { example: string }) {
  const { data } = await api.patch<{ id: number; example: string; }>(`intents/${intentId}/examples`);
  return data;
}

export async function deleteExample(intentId: string | number) {
  const { data } = await api.delete<void>(`intents/${intentId}/examples`);
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
