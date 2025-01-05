import { Node } from 'reactflow';
import { GenerateNewNodeConfig } from './nodes';

export const generateStoryStepsFromNodes = (nodes: Node[]) =>
    nodes.map(({ data: { type, label, payload, checkpoint }}) => {
        switch (type) {
            case 'intentNode':
                if (payload.entities === undefined) {
                    return {
                        intent: label,
                        entities: [],
                    };
                } else if (payload.entities.length > 0 &&
                    typeof payload.entities[0] === 'string') {
                    return {
                        intent: label,
                        entities: payload.entities || []
                    };
                } else {
                    return {
                        intent: label,
                        entities: payload.entities.map((entity) => parseValue(entity.value)) || [],
                    };
                }
            case 'responseNode':
                return { action: label };
            case 'formNode':
                return {
                    form: label,
                    active_loop: payload.active_loop !== undefined ? payload.active_loop : true,
                };
            case 'slotNode':
                return {
                    slot_was_set: [{
                        [label]: parseValue(payload?.value),
                    }],
                };
            case 'actionNode': {
                const value = checkpoint
                  ? { action: parseValue(payload?.value) || label }
                  : { action: label };
                if (
                  value.action === 'conversation_start: true' ||
                  value.action === 'wait_for_user_input: false'
                )
                  break;
                return value;
            }
            case 'conditionNode': {
                let conditions: { active_loop?: any; slot?: any; value?: any; }[] = [];

                payload.conditions.forEach((condition: { active_loop: { value: any; }; slot: { value: any; }; value: any; }) => {
                    if (condition.active_loop) {
                        conditions.push({ "active_loop": parseValue(condition.active_loop.value) });
                    }
                    if (condition.slot) {
                        conditions.push({ "slot": condition.slot.value });
                        conditions.push({ "value": parseValue(condition?.value) });
                    }
                });

                return {
                    condition: conditions,
                };
            }
            default:
                return null;
        }
    }).filter(Boolean);

export const generateNodesFromStorySteps = (
  steps,
): Node[] =>
  steps
    ?.map((step) => {
      let type;
      let label;
      let payload;
      let className;

      if (step.condition && Array.isArray(step.condition)) {
        type = 'conditionNode';
        className = 'condition';
        payload = {
          conditions: step.condition.map((condition) => {
            if (condition.active_loop) {
              return { active_loop: { label: condition.active_loop } };
            }
            if (condition.slot_was_set) {
              const [slotLabel, value] = Object.entries(
                condition.slot_was_set
              )[0];
              return { slot: { label: slotLabel, value: String(value) } };
            }
            return null;
          }),
        };
      } else if (step.intent) {
        type = 'intentNode';
        className = 'intent';
        label = step.intent;
        if (step.entities !== undefined) {
          payload = {
            entities:
              step.entities.map((entityObj: {}) => {
                const key = Object.keys(entityObj)[0];
                return { label: key, value: String(key) };
              }) || [],
          };
        } else {
          payload = { entities: [] };
        }
      } else if (step.action) {
        if (step.active_loop !== undefined) {
          type = 'formNode';
          className = 'form';
          label = step.action;
          payload = { active_loop: step.active_loop !== null };
        } else if (step.action === 'action_listen' || step.action === 'action_restart') {
          type = 'actionNode';
          className = 'action';
          label = step.action;
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
        payload = { value: String(value) };
      } else {
        return null;
      }

      return {
        label,
        type,
        className,
        payload,
      };
    })
    .filter(Boolean);

export const generateNodesFromRuleActions = (
  conversationStart: string,
  waitForUserInput: string
): Array<Pick<GenerateNewNodeConfig, 'label' | 'type' |'className'>> => {
  const nodes = [];

  if (conversationStart.length > 0) {
    nodes.push({
      label: 'conversation_start: true',
      type: 'actionNode',
      className: 'action',
    });
  }

  if (waitForUserInput.length > 0) {
    nodes.push({
      label: 'wait_for_user_input: false',
      type: 'actionNode',
      className: 'action',
    });
  }

  return nodes;
};

const  parseValue = (value: string | null | undefined) => {
  if (!value) return null;
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  
  return value;
}
