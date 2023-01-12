import api from './api';

export async function addResponse(newResponseData: { name: string; text: string }) {
  const { data } = await api.post<{ name: string; text: string; }>('responses', newResponseData);
  return data;
}

export async function editResponse(id: string | number, responseData: { text: string }) {
  const { data } = await api.patch<{ name: string; text: string; }>(`responses/${id}`, responseData);
  return data;
}

export async function deleteResponse(id: string | number) {
  const { data } = await api.delete<void>(`responses/${id}`);
  return data;
}
