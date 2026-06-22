import { rasaApi } from './api';
import { Model, UpdateModelDTO } from 'types/model';

export async function activateModel(modelData: UpdateModelDTO) {
  const { data } = await rasaApi.post<Model>('model/trained-model', modelData);
  return data;
}

export async function deleteModel(id: string | number) {
  await rasaApi.get<void>(`model/delete-model?fileName=${id}`);
}

export async function addModelDescription(fileName: string, description: string) {
  const { data } = await rasaApi.post<{ message: string }>('model/add-model-description', {
    fileName,
    description,
  });
  return data;
}
