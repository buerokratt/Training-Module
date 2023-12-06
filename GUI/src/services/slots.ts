import api from './api';
import { Slot, SlotCreateDTO, SlotEditDTO } from 'types/slot';

export async function createSlot(formData: SlotCreateDTO) {
  const slot = validateSlot(formData);
  const { data } = await api.post<Slot>(`slots/add`, slot);
  return data;
}

export async function editSlot(id: string | number, formData: SlotEditDTO) {
  const { data } = await api.patch<Slot>(`slots/${id}`, formData);
  return data;
}

export async function deleteSlot(slot: string | number) {
  const { data } = await api.post<void>(`slots/delete`, {slotName: slot});
  return data;
}

const validateSlot = (formData : SlotCreateDTO | SlotEditDTO) => {
  return {
    slot: {
      [formData.name] : {
        influence_conversation : formData.influenceConversation || false,
        type: 'text',
        mappings: [{
          type: formData.mappings.type || 'from_text',
          entity: formData.mappings.entity || 'test',
          intent: formData.mappings.intent || [],
          notIntent: formData.mappings.notIntent || []
        }]
      }
    }
  }
}
