import api from './api';

export async function addIntent(newIntentData: { name: string }) {
  const { data } = await api.post('intents', newIntentData);
  return data;
}

export async function editIntent(id: string | number, intentData: { name: string }) {
  const { data } = await api.patch(`intents/${id}`, intentData);
  return data;
}

export async function addExample(intentId: string | number, exampleData: { example: string }) {
  const { data } = await api.post<{ id: number; example: string; }>(`intents/${intentId}/examples`, exampleData);
  return data;
}
