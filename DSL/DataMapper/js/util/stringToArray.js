import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let { data } = req.body;
    const removedQuot = data.replaceAll("&quot;","");
    const removedHyphens = removedQuot.replace(/^- /gm, "");
    const newArray = removedHyphens.split('\n');
    res.json(newArray.filter(el => "" !== el.trim()));
});

export default router;
