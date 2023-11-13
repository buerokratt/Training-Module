import { Node } from 'reactflow';

export const generateRasaStoryData = (
  editableTitle: string | null,
  mode: string,
  nodes: Node<any, string | undefined>[]
) => {
  console.log(nodes);

  const steps = nodes.map(({ data: { type, label, payload, checkpoint }}) => {
    switch (type) {
        case 'conditionNode':
            return { 
              intent: 'condition',
              action: 'action'
            };
        case 'intentNode':
            return {
                intent: label,
                action: `utter_${label}`,
                entities: node.entities || [],
                slots: node.slots || [],
            };
        case 'responseNode':
            return { action: label };
        case 'formNode':
            return {
                action: label,
                active_loop: payload.active_loop === false ? null: label,
            };
        case 'slotNode':
            return {
                slot_was_set: {
                  [label]: payload.value,
                }
            };
        case 'actionNode':
            return checkpoint
              ? { 'action': payload?.value || label, }
              : { 'action': label, }
        default:
            return null;
    }
  }).filter(Boolean);

  return {
      story: editableTitle || (mode === 'new' ? 'new_story' : 'edit_story'),
      steps,
  };
};
