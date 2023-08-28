import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  const { json, searchKey, newKey, newKeyValue } = req.body;
  if (!json || !searchKey || !newKey || !newKeyValue) {
    return res.status(400).send('json, searchKey, newKey, newKeyValue are required fields');
  }

  Object.entries(json).map(([key, _]) => {
    if (key.includes(searchKey)) {
      json[newKey] = [{
        text: newKeyValue,
      }];
      delete json[key];
    }
  });

  return res.status(200).send(json);
});

export default router;
