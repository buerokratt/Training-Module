import { Node } from 'reactflow';

export const generateStoryStepsFromNodes = (nodes: Node[]) =>
    nodes.map(({ data: { type, label, payload, checkpoint }}) => {
        switch (type) {
            case 'intentNode':
                return {
                    intent: label,
                    entities: payload.entities || [],
                };
            case 'responseNode':
                return { action: label };
            case 'formNode':
                return {
                    action: label,
                    active_loop: payload.active_loop !== undefined ? payload.active_loop : null,
                };
            case 'slotNode':
                return {
                    slot_was_set: {
                        [label]: payload.value,
                    },
                };
            case 'actionNode':
                return checkpoint
                    ? { action: payload?.value || label }
                    : { action: label };
            case 'conditionNode':
                return {
                    condition: payload.conditions || [],
                };
            default:
                return null;
        }
    }).filter(Boolean);

export const generateNodesFromStorySteps = (steps): Node[] =>
    steps?.map((step) => {
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
                entities: step.entities?.map((entity) => {
                    return {
                        value: Object.keys(entity)[0],
                    };
                }) || [],
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
        } else {
            return null;
        }

        return {
            label,
            type,
            className,
            payload,
        };
    }).filter(Boolean);

