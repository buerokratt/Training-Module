import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { date, days } = req.body;

    const startFrom = Date.parse(date);
    const time = date.split("T")[1].split(".")[0]
    const cronTime = time.split(":").reverse().join(' ');
    const expression = `${cronTime} ? * ${days} *`;
    const result = {
        expression: expression,
        startDate: startFrom
    }

    res.json(result);
});

export default router;
