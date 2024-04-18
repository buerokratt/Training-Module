import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { object, serviceName, paramName,newValue } = req.body;

    const serviceToUpdate = object.services[serviceName];
    serviceToUpdate[paramName] = newValue;

    res.json(object);
});

export default router;
