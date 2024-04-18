import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { object, name } = req.body;

    const serviceParameters = object.services['train-bot'].command;
    const index = serviceParameters.indexOf('--fixed-model-name');

    if(index !== -1 && index < serviceParameters.length -1) {
        const fileName = serviceParameters[index + 1];
        res.json(fileName.split(name)[1])
    } else {
        res.json('1_0');
    }


});

export default router;
