import api from './api';
import { Model, UpdateModelDTO } from 'types/model';

export async function activateModel(id: string | number, modelData: UpdateModelDTO) {
  const { data } = await api.patch<Model>(`models/${id}`, modelData);
  return data;
}

export async function deleteModel(id: string | number) {
  const { data } = await api.delete<void>(`models/${id}`);
  return data;
}
