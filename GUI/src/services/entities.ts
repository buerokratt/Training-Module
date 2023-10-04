import api from './temp-api';
import { Entity } from 'types/entity';

export async function addEntity(entityData: { name: string }) {
  const { data } = await api.post('entities', entityData);
  return data;
}

export async function editEntity(entityData: { entity_name: string, entity: string, intent: string }) {
  if(entityData.entity.trim().length === 0) {
    entityData.entity = entityData.entity_name;
  }
  const { data } = await api.post<Entity>(`entities/update`, entityData);
  return data;
}

export async function deleteEntity(id: string | number) {
  const { data } = await api.delete<void>(`entities/${id}`);
  return data;
}
