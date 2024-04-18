import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { array, element, newValue } = req.body;

    if (!array || !element || !newValue) {
        res.status(400).send('Array, element and newValue are required');
        return;
    }

    const index = array.indexOf(element);
    if (index === -1) {
        res.status(400).send(`Array element ${element} is missing`);
        return;
    }

    array[index] = newValue;
    res.json(array);
});

export default router;
