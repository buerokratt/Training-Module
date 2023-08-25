import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { object1, object2 } = req.body;

    if (!object1 || !object2) {
        res.status(400).send('Both objects are required');
        return;
    }

    res.json({ ...object1, ...object2 });
});

export default router;
