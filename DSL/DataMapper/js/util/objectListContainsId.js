import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { id, list } = req.body;
    const exists = checkIdExists(list, id);
    res.json(exists);
});

function checkIdExists(array, id) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return true;
        }
    }
    return false;
}

export default router;
