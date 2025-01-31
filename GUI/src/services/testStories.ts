import { rasaApi } from './api';

export async function deleteTestStory(id: string | number) {
  const { data } = await rasaApi.delete<void>(`test-stories/${id}`);
  return data;
}
