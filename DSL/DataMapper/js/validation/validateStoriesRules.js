import express from 'express';

const router = express.Router();
router.post('/', (req, res) => {
    const steps = req.category === 'rules' ? req.body.rule.steps : req.body.story.steps;
    const isValid = validateStepsForNoConsecutiveDuplicates(steps);
    res.json({ result: isValid });
});

function validateStepsForNoConsecutiveDuplicates(steps) {
    for (let i = 1; i < steps.length; i++) {
        const currentStep = steps[i];
        const previousStep = steps[i - 1];

        if (currentStep.intent && previousStep.intent) {
            if (currentStep.intent === previousStep.intent) {
                return false;
            }
        }

        if (currentStep.entities && previousStep.entities) {
            if (hasCommonElement(currentStep.entities, previousStep.entities)) {
                return false;
            }
        }
    }

    return true;
}

function hasCommonElement(arr1, arr2) {
    return arr1.some(element => arr2.some(item => item.entity === element.entity));
}

export default router;
