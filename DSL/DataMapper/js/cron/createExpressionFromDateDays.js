import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { date, days } = req.body;

    const startFrom = date.split('T')[0];
    const time = date.split("T")[1].split(".")[0]
    const cronTime = time.split(":").reverse().join(' ');
    const result = `${cronTime} ? * ${days} *`;

    res.json(result.toString());
});

export default router;
