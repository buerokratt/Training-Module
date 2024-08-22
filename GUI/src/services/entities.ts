import { rasaApi } from './api';
import { Entity } from 'types/entity';

export async function addEntity(entityData: { entity: string }) {
  const { data } = await rasaApi.post('entities/add', entityData);
  return data;
}

export async function editEntity(entityData: { entity_name: string, entity: string, intent: string }) {
  if(entityData.entity.trim().length === 0) {
    entityData.entity = entityData.entity_name;
  }
  const { data } = await rasaApi.post<Entity>(`entities/update`, entityData);
  return data;
}

export async function deleteEntity(entityData: { entity_name: string | number }) {
  const { data } = await rasaApi.post<void>(`entities/delete`, entityData);
  return data;
}
