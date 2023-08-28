import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  const { rulesJson, searchIntentName } = req.body;
  const strRegExPattern = ".*\\b" + searchIntentName + "\\b.*";
  const regExp = new RegExp(strRegExPattern);

  const result = rulesJson
      .map((entry) => {
        const containsSearchTerm = regExp.test(JSON.stringify(entry));
        if (!containsSearchTerm) return entry;
      })
      .filter(value => value);

  return res.status(200).send({ result });
});

export default router;
