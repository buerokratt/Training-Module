export interface Slot {
  readonly id: number;
  name: string;
  type: 'text' | 'entity';
  influenceConversation: boolean;
  mappings?: {
    entity: string | null;
    intent: string | null;
    notIntent: string | null;
  };
}

export interface SlotCreateDTO extends Omit<Slot, 'id'> {
}

export interface SlotEditDTO extends Omit<Slot, 'id'> {
}
