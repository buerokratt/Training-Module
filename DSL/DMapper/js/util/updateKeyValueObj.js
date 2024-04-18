import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let { object, oldKey, newKey, newValue } = req.body;

    const result = Object.entries(object).reduce((acc, [key, value]) => {
        if (key === oldKey) {
            acc[newKey] = newValue;
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});

    res.json(result);
});

export default router;
