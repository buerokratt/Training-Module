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

interface RemoveArrayItem {
    array: Array<string>;
    value: string;
}
router.post('/remove-array-value', (req, res) => {
    const { array, value }: RemoveArrayItem = req.body;
    console.log(req.body);

    if (!array || !value) {
        res.status(400).send('Both array and value are required');
        return;
    }
    const filteredArray = array.filter(function (e) {
        return e !== value
    });
    res.json(filteredArray);
});

interface ReplaceArrayElement {
    array: Array<string>;
    element: string;
    newValue: string;
}
router.post('/replace-array-element', (req, res) => {
    const { array, element, newValue }: ReplaceArrayElement = req.body;
    console.log(req.body);

    if (!array || !element || !newValue) {
        res.status(400).send('Array, element and newValue are required');
        return;
    }
    const index = array.indexOf(element);
    if (index == -1) {
        res.status(400).send("Array element {element} is missing");
        return;
    }
    array[index] = newValue;
    res.json(array);
});

export default router;
