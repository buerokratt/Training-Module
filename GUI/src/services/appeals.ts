import { rasaApi } from './api';

export async function addAppeal(appealData: { message: string }) {
  const { data } = await rasaApi.post<{ readonly id: number; message: string; }>('appeals', appealData);
  return data;
}

export async function deleteAppeal(id: string | number) {
  const { data } = await rasaApi.delete<void>(`appeals/${id}`);
  return data;
}
