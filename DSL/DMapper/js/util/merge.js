import express from 'express';
import array from 'lodash';

const router = express.Router();

router.post('/', (req, res) => {
    const { array1, array2, iteratee } = req.body;

    if (!array1 || !array2) {
        res.status(400).send('Both arrays are required');
        return;
    }

    const merged = array.unionBy(array2, array1, iteratee);

    res.json(merged);
});

export default router;
