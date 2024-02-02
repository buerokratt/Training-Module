import express from 'express';
import multer from 'multer';
import yaml, { stringify } from 'yaml';
const router = express.Router();

router.post('/', multer().array('file'), async (req, res) => {
    const result = {
        version: '3.0',
        stories: (req.body.stories || []).map(entry => ({
            story: entry.story,
            steps: entry.steps.map(step => {
                const formattedStep = {};
                switch (true) {
                    case !!step.intent:
                        formattedStep.intent = step.intent;
                        break;
                    case !!step.entities:
                        formattedStep.entities = step.entities;
                        break;
                    case !!step.action:
                        formattedStep.action = step.action;
                        break;
                    case !!step.checkpoint:
                        formattedStep.checkpoint = step.checkpoint;
                        break;
                    case !!step.slot_was_set && step.slot_was_set.length > 0:
                        formattedStep.slot_was_set = step.slot_was_set;
                        break;
                    default:
                        break;
                }
                return formattedStep;
            }).filter(step => Object.keys(step).length > 0),
        })).filter(entry => entry.steps.length > 0),
    };

    const yamlString = yaml.stringify(result);

    res.json({ "json": yamlString });
});

export default router;
