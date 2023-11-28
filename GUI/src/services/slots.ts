import api from './api';
import { Slot, SlotCreateDTO, SlotEditDTO } from 'types/slot';

export async function createSlot(formData: SlotCreateDTO) {
  const { data } = await api.post<Slot>(`slots`, formData);
  return data;
}

export async function editSlot(id: string | number, formData: SlotEditDTO) {
  const { data } = await api.patch<Slot>(`slots/${id}`, formData);
  return data;
}

export async function deleteSlot(slot: string) {
  const { data } = await api.post<void>(`slots/delete`, {slot_name: slot});
  return data;
}
