import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { array, length } = req.body;

    if (!array || !length) {
        res.status(400).send('Both array and length parameters are required');
        return;
    }

    res.json(array.every((value) => value.length <= length));
});

export default router;
