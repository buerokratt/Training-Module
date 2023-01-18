import api from './api';

export async function deleteTestStory(id: string | number) {
  const { data } = await api.delete<void>(`test-stories/${id}`);
  return data;
}
