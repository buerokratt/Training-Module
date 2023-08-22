import express, { Router } from 'express';
const router: Router = express.Router();

interface RemoveArrayItem {
    array: Array<string>;
    value: string;
}
router.post('/', (req, res) => {
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
export default router;
