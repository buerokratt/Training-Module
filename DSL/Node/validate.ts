import express, { Router } from 'express';
const router: Router = express.Router();

interface ArrayElementsLengthBody {
    array: Array<string>;
    length: number;
}

router.post('/', (req, res) => {
    const { array, length }: ArrayElementsLengthBody = req.body;

    if (!array || !length) {
        res.status(400).send('Both array and length parameters are required');
        return;
    }

    res.json(array.every((value) => value.length <= length));
});

export default router;
