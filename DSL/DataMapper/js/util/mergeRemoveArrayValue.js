import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { array, value } = req.body;

    if (!array || !value) {
        res.status(400).send('Both array and value are required');
        return;
    }

    const filteredArray = array.filter(function (e) {
        return e !== value;
    });

    res.json(filteredArray);
});

export default router;
