import express from 'express';
import fs from 'fs';

const router = express.Router();

router.post('/', (req, res) => {
    const file_path = req.body.file_path;

    if (!file_path) {
        res.status(400).send('File path is required');
        return;
    }
    if (file_path.includes('..')) {
        res.status(400).send('Relative paths are not allowed');
        return;
    }

    const fileNames = fs.readdirSync(file_path, 'utf-8');
    res.json(fileNames);
});

export default router;
