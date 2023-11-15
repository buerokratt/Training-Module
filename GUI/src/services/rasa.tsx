import { Node } from 'reactflow';

export const generateStoryStepsFromNodes = (nodes: Node[]) => 
  nodes.map(({ data: { type, label, payload, checkpoint }}) => {
    switch (type) {
        case 'conditionNode':
            return { 
              condition: (payload.conditions || []).map((x: any) => {
                if(x.active_loop)
                  return { active_loop: x.active_loop.label }
                if(x.slot)
                  return { slot_was_set: { [x.slot.label]: x.value } }
                return null;
              }).filter(Boolean),
            };
        case 'intentNode':
            return {
                intent: label,
                entities: (payload.entities || []).map((x: any) => ({ [x.label]: x.value })),
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

export const generateNodesFromStorySteps = (steps) : Node[] => steps?.map((step) => {
    console.log(step)
    let type;
    let label;
    let payload;
    let className;

    if (step.condition) {
      type = 'conditionNode';
      className = 'condition';
      payload = {
        conditions: step?.condition?.map((condition) => {
          if (condition.active_loop) {
            return { active_loop: { label: condition.active_loop } };
          }
          if (condition.slot_was_set) {
            const [slotLabel, value] = Object.entries(condition.slot_was_set)[0];
            return { slot: { label: slotLabel, value } };
          }
          return null;
        }),
      };
    } else if (step.intent) {
      type = 'intentNode';
      className = 'intent';
      label = step.intent;
      payload = {
        entities: step?.entities?.map((entity) => {
          const [entityLabel, value] = Object.entries(entity)[0];
          return { label: entityLabel, value };
        }),
      };
    } else if (step.action) {
      if (step.active_loop !== undefined) {
        type = 'formNode';
        className = 'form';
        label = step.action;
        payload = { active_loop: step.active_loop !== null };
      } else {
        type = 'responseNode';
        className = 'response';
        label = step.action;
      }
    } else if (step.slot_was_set) {
      type = 'slotNode';
      className = 'slot';
      const [slotLabel, value] = Object.entries(step.slot_was_set)[0];
      label = slotLabel;
      payload = { value };
    } else if (step.action) {
      type = 'actionNode';
      className = 'action';
      label = step.action;
      payload = { value: step.action };
    }
    else {
      return null;
    }

    return {
      label,
      type,
      className,
      payload,
    };
}).filter(Boolean);
