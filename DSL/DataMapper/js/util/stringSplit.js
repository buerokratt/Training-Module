import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let { data, separator } = req.body;
    res.send(data.split(separator).filter(function(n) { return n; })); // filter removes empty array elements.
});

export default router;
