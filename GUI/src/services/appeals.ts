import api from './api';

export async function addAppeal(appealData: { message: string }) {
  const { data } = await api.post<{ readonly id: number; message: string; }>('appeals', appealData);
  return data;
}

export async function deleteAppeal(id: string | number) {
  const { data } = await api.delete<void>(`appeals/${id}`);
  return data;
}
