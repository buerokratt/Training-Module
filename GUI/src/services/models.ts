import api from './api';
import { Model, UpdateModelDTO } from 'types/model';

export async function activateModel(modelData: UpdateModelDTO) {
  const { data } = await api.post<Model>('model/trained-model', modelData);
  return data;
}

export async function deleteModel(id: string | number) {
  const { data } = await api.get<void>(`model/delete-model?fileName=${id}`);
  return data;
}
