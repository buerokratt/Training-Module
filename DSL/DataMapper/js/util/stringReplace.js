import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let { data, search, replace } = req.body;
    if (search === "|") {
        res.json(data.replace(/(examples:.*?)\|/g, '$1'));
    } else {
        res.json(data.replaceAll(search, replace));
    }
});

export default router;
