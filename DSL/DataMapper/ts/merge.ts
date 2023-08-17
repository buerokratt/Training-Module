import express, { Router } from 'express';
import array from "lodash";
const router: Router = express.Router();

interface MergeRequestBody {
    array1: Array<Record<string, any>>;
    array2: Array<Record<string, any>>;
    iteratee: string;
}

router.post('/', (req, res) => {
    const { array1, array2, iteratee }: MergeRequestBody = req.body;

    if (!array1 || !array2) {
        res.status(400).send('Both arrays are required');
        return;
    }

    const merged = array.unionBy(array2, array1, iteratee);

    res.json(merged);
});

export default router;
