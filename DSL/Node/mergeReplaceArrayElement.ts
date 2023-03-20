import express, { Router } from 'express';
const router: Router = express.Router();

interface ReplaceArrayElement {
    array: Array<string>;
    element: string;
    newValue: string;
}
router.post('/', (req, res) => {
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
