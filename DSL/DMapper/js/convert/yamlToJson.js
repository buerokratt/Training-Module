import express from 'express';
import multer from 'multer';
import { parse } from 'yaml';
import base64ToText from './base64ToText.js';

const router = express.Router();

router.post('/', multer().array('file'), async (req, res) => {
    const file = base64ToText(req.body.file);
    const result = parse(file);
    res.send(result);
});

export default router;
