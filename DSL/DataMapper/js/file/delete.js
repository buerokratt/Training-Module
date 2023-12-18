import fs from 'fs';
import express from "express";

const router = express.Router();

router.post('/', (req, res) => {
  const filePath = req.body.file_path;

  if (!filePath) {
    res.status(400).send('Filename is required');
    return;
  }

  if (filePath.includes('..')) {
    res.status(400).send('Relative paths are not allowed');
    return;
  }

  try {
    fs.unlinkSync(filePath);
    res.json(true).send();
  } catch (err) {
    return {
      error: true,
      message: 'Unable to delete file'
    }
  }
});

export default router;
