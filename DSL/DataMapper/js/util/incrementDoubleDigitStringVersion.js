import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { version } = req.body;
    const splitVersion = version.split('_');
    const majorV = splitVersion[0];
    let minorV = parseInt(splitVersion[1]);
    minorV += 1;
    res.json(`${majorV}_${minorV}`);
});

export default router;
