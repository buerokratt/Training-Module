export interface Slot {
  readonly id: number;
  name: string;
  type: 'text';
  influenceConversation: boolean;
  mappings: {
    type: 'from_text' | 'from_entity';
    entity: string;
    intent: string[] | null;
    notIntent: string[] | null;
  };
}

export interface SlotResponse {
  id: string;
  name: string;
  text: string;
}

export interface SlotCreateDTO extends Omit<Slot, 'id'> {
}

export interface SlotEditDTO extends Omit<Slot, 'id'> {
}
