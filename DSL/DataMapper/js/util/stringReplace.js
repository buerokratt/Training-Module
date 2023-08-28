import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let { data, search, replace } = req.body;
    res.json(data.replaceAll(search, replace));
});

export default router;
