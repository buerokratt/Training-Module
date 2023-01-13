import api from './api';

export async function deleteEntity(id: string | number) {
  const { data } = await api.delete<void>(`entities/${id}`);
  return data;
}
