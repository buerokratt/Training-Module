import express, { Router } from 'express';
import path from "path";
import fs from "fs";
const router: Router = express.Router();


router.post('/read', (req, res) => {
    const file_path = req.body.file_path;

    if (!file_path) {
        res.status(400).send('File path is required');
        return;
    }

    if (path.normalize(file_path).startsWith('..')) {
        res.status(400).send('Relative paths are not allowed');
        return;
    }

    fs.readFile(file_path, 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }
        const file = Buffer.from(data).toString('base64');

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ file }));
    });
});

interface FileRequestBody {
    file_path: string;
    content: string | Buffer;
}

router.post('/write', (req, res) => {
    const { file_path, content }: FileRequestBody = req.body;

    if (!file_path || !content) {
        res.status(400).send('Filename and content are required');
        return;
    }

    if (path.normalize(file_path).startsWith('..')) {
        res.status(400).send('Relative paths are not allowed');
        return;
    }

    fs.writeFile(file_path, content, (err) => {
        if (err) {
            res.status(500).send('Unable to save file');
            return;
        }

        res.status(201).send('File saved successfully');
    });
});

export default router;
