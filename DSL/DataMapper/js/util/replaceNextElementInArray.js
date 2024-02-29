import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { array, element, newInput } = req.body;

    const index = array.indexOf(element);

    if(index !== -1 && index < array.length -1) {
        array[index + 1] = newInput.toString();
    }

    return res.status(200).send({ array });
});

export default router;
