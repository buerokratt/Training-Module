import express, { Router } from 'express';

const router: Router = express.Router();

interface RequestBody {
  readonly rulesJson: {
    readonly rule: string;
    readonly steps: {
      readonly intent: string;
      readonly action: string;
    }[];
  }[];
  readonly searchIntentName: string;
}

router.post('/', (req, res) => {
  const { rulesJson, searchIntentName }: RequestBody = req.body;
  const strRegExPattern = ".*\\b" + searchIntentName + "\\b.*";
  const regExp = RegExp(strRegExPattern);

  const result = rulesJson
    .map((entry) => {
      const containsSearchTerm = regExp.test(JSON.stringify(entry));
      if (!containsSearchTerm) return entry;
    })
    .filter(value => value);


  return res.status(200).send({ result });
});

export default router;
