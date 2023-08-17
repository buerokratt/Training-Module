import express, { Router } from 'express';
const router: Router = express.Router();

interface MergeObjects {
    object1: Record<string, any>;
    object2: Record<string, any>;
}
router.post('/', (req, res) => {
    const { object1, object2 }: MergeObjects = req.body;
    console.log(req.body);

    if (!object1 || !object2) {
        res.status(400).send('Both objects are required');
        return;
    }

    res.json({ ...object1, ...object2 });
});
export default router;
