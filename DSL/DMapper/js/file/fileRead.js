import express from 'express';
import fs from 'fs';
import mime from 'mime-types';

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

    fs.readFile(file_path, 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }

        const mimeType = mime.lookup(file_path);
        const name = file_path.split(/(\\|\/)/g).pop();
        const file = Buffer.from(data).toString('base64');

        const result = {
            name: name,
            file: file,
            mimeType: mimeType
        };

        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});

export default router;
