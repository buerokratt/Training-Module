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

interface MergeObjects {
    object1: Record<string, any>;
    object2: Record<string, any>;
}
router.post('/objects', (req, res) => {
    const { object1, object2 }: MergeObjects = req.body;
    console.log(req.body);

    if (!object1 || !object2) {
        res.status(400).send('Both objects are required');
        return;
    }

    res.json({ ...object1, ...object2 });
});

interface RemoveKey {
    object: Record<string, any>;
    key: string;
}
router.post('/remove-key', (req, res) => {
    const { object, key }: RemoveKey = req.body;
    console.log(req.body);

    if (!object || !key) {
        res.status(400).send('Both object and key are required');
        return;
    }
    delete object[key];
    res.json(object);
});

export default router;
