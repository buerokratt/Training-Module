import api from './api';

export async function addExample(intentId: string | number, exampleData: { example: string }) {
  const { data } = await api.post<{ id: number; example: string; }>(`intents/${intentId}/examples`, exampleData);
  return data;
}
