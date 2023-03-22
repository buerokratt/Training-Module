import express, { Router } from 'express';
import fs from "fs";
const router: Router = express.Router();

interface FileRequestBody {
    file_path: string;
    content: string | Buffer;
}

router.post('/', (req, res) => {
    const { file_path, content }: FileRequestBody = req.body;

    if (!file_path || !content) {
        res.status(400).send('Filename and content are required');
        return;
    }

    if (file_path.includes('..')) {
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
