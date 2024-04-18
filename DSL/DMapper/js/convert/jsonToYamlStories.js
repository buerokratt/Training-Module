import express from 'express';
import multer from 'multer';
import yaml from 'yaml';

const router = express.Router();

router.post('/', multer().array('file'), async (req, res) => {
    let result;
    const { stories, rules } = req.body;

    if (stories) {
        result = {
            version: '3.0',
            stories: stories.map(entry => ({
                story: entry.story,
                steps: entry.steps.map(step => {
                    const formattedStep = {};
                    switch (true) {
                        case !!step.intent:
                            formattedStep.intent = step.intent;
                            if (step.entities && step.entities.length > 0) {
                                formattedStep.entities = step.entities.map(entity => ({
                                    [entity]: ""
                                }));
                            }
                            break;
                        case !!step.action:
                            formattedStep.action = step.action;
                            break;
                        case !!step.slot_was_set && Object.keys(step.slot_was_set).length > 0:
                            formattedStep.slot_was_set = step.slot_was_set;
                            break;
                        case !!step.condition && step.condition.length > 0:
                            formattedStep.condition = step.condition;
                            break;
                        default:
                            break;
                    }
                    return formattedStep;
                }).filter(step => Object.keys(step).length > 0),
            })).filter(entry => entry.steps.length > 0),
        };
    } else if (rules) {
        result = {
            version: '3.0',
            rules: rules.map(entry => ({
                rule: entry.rule,
                steps: entry.steps.map(step => {
                    const formattedStep = {};
                    switch (true) {
                        case !!step.intent:
                            formattedStep.intent = step.intent;
                            if (step.entities && step.entities.length > 0) {
                                formattedStep.entities = step.entities.map(entity => ({
                                    [entity]: ""
                                }));
                            }
                            break;
                        case !!step.action:
                            formattedStep.action = step.action;
                            break;
                        case !!step.slot_was_set && Object.keys(step.slot_was_set).length > 0:
                            formattedStep.slot_was_set = step.slot_was_set;
                            break;
                        case !!step.condition && step.condition.length > 0:
                            formattedStep.condition = step.condition;
                            break;
                        default:
                            break;
                    }
                    return formattedStep;
                }).filter(step => Object.keys(step).length > 0),
            })).filter(entry => entry.steps.length > 0),
        };
    } else {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    const yamlString = yaml.stringify(result, {
        customTags: [
            {
                tag: 'tag:yaml.org,2002:seq',
                format: 'flow',
                test: (value) => value && value.length === 0,
                resolve: () => ''
            }
        ]
    });

    res.json({ "json": yamlString });
});

export default router;
