import express, { Router } from 'express';
const router: Router = express.Router();

interface RemoveKey {
    object: Record<string, any>;
    key: string;
}
router.post('/', (req, res) => {
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
