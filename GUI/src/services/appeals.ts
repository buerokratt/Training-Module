import api from './api';

export async function deleteAppeal(id: string | number) {
  const { data } = await api.delete<void>(`appeals/${id}`);
  return data;
}
