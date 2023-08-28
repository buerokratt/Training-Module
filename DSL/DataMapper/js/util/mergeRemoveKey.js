import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { object, key } = req.body;

    if (!object || !key) {
        res.status(400).send('Both object and key are required');
        return;
    }

    delete object[key];
    res.json(object);
});

export default router;
