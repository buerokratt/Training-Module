import express from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import base64ToText from './base64ToText.js';

const router = express.Router();

router.post('/', multer().array('file'), async (req, res) => {
    const file = base64ToText(req.body.file);
    let result = Papa.parse(file, { skipEmptyLines: true });
    res.send(result.data);
});

export default router;
