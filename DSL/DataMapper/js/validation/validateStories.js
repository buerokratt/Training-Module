import express from 'express';

const router = express.Router();
router.post('/', (req, res) => {

    const steps = req.body.story.steps;
    const isValid = validateStepsForNoConsecutiveDuplicates(steps);
    res.json({ result: isValid });

});

function validateStepsForNoConsecutiveDuplicates(steps) {

    for (let i = 1; i < steps.length; i++) {
        const currentStep = steps[i];
        const previousStep = steps[i - 1];

        if (currentStep.entities && previousStep.entities && areConsecutive(currentStep, previousStep)) {
            const currentEntities = currentStep.entities.map(entity => entity.entity);
            const previousEntities = previousStep.entities.map(entity => entity.entity);

            if (hasCommonElement(currentEntities, previousEntities)) {
                return false;
            }
        }

        if (currentStep.intent && previousStep.intent && areConsecutive(currentStep, previousStep)) {
            if (currentStep.intent === previousStep.intent) {
                return false;
            }
        }
    }

    return true;
}

function hasCommonElement(arr1, arr2) {
    return arr1.some(element => arr2.includes(element));
}

function areConsecutive(currentStep, previousStep) {
    return currentStep.start === previousStep.end + 1;
}

export default router;
