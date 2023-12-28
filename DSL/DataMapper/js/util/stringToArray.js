import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let { data } = req.body;
    if(data.length > 0) {
        const removedQuot = data.replaceAll("&quot;","");
        const removedHyphens = removedQuot.replace(/^- /gm, "");
        const newArray = removedHyphens.split('\n');
        res.json(newArray.filter(el => "" !== el.trim()));
    } else {
        res.json([])
    }
});

export default router;
