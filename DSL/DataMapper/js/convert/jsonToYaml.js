import express from 'express';
import multer from 'multer';
import { stringify } from 'yaml';

const router = express.Router();

router.post('/', multer().array('file'), async (req, res) => {
    let result = stringify(req.body);
    res.json({ "json": result });
});

export default router;
