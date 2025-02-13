import { rasaApi } from './api';
import { Slot, SlotCreateDTO, SlotEditDTO } from 'types/slot';

export async function createSlot(formData: SlotCreateDTO) {
  const slot = validateSlot(formData);
  const { data } = await rasaApi.post<Slot>(`slots/add`, slot);
  return data;
}

export async function editSlot(oldName: string, formData: SlotEditDTO) {
  const slot = validateSlot(formData);
  const { data } = await rasaApi.post<Slot>(`slots/update`, {oldName,slot});
  return data;
}

export async function deleteSlot(slot: string | number) {
  const { data } = await rasaApi.post<void>(`slots/delete`, {slotName: slot});
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
