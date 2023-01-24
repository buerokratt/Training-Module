import api from './api';

export async function addRegex(regexData: { name: string }) {
  const { data } = await api.post<{ readonly id: number; name: string }>('regex');
  return data;
}

export async function editRegex(id: string | number, regexData: { name: string }) {
  const { data } = await api.patch<{ readonly id: number; name: string }>(`regex/${id}`, regexData);
  return data;
}

export async function deleteRegex(id: string | number) {
  const { data } = await api.delete<void>(`regex/${id}`);
  return data;
}
