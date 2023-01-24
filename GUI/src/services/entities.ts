import api from './api';
import { Entity } from 'types/entity';

export async function addEntity(entityData: { name: string }) {
  const { data } = await api.post('entities', entityData);
  return data;
}

export async function editEntity(id: string | number, entityData: { name: string }) {
  const { data } = await api.patch<Entity>(`entities/${id}`, entityData);
  return data;
}

export async function deleteEntity(id: string | number) {
  const { data } = await api.delete<void>(`entities/${id}`);
  return data;
}
