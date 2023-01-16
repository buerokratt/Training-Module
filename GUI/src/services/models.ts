import api from './api';

export async function deleteModel(id: string | number) {
  const { data } = await api.delete<void>(`models/${id}`);
  return data;
}
