import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { object, servicesArray, newVersion } = req.body;
    servicesArray.forEach((service) => {
        if(service === 'train-bot') {
            const selectedService = object.services[service];
            selectedService.command = replaceNextElementInArray(selectedService.command,'--fixed-model-name',`${newVersion}`)
        } else if(service === 'test-bot') {
            const selectedService = object.services[service];
            selectedService.command = replaceNextElementInArray(selectedService.command,'--out',`results/${newVersion}`)
        } else if(service === 'test-bot-cv') {
            const selectedService = object.services[service];
            selectedService.command = replaceNextElementInArray(selectedService.command,'--out',`results/cross-${newVersion}`)
        }
    });
    res.json(object);
});

const replaceNextElementInArray = (array, element, newInput) => {
    const index = array.indexOf(element);

    if(index !== -1 && index < array.length -1) {
        array[index + 1] = newInput.toString();
    }
    return array;
};

export default router;
