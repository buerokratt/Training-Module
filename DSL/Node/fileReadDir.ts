import express, { Router } from 'express';
import path from "path";
import fs from "fs";
const router: Router = express.Router();

router.post('/', (req, res) => {
    const file_path = req.body.file_path;

    if (!file_path) {
        res.status(400).send('File path is required');
        return;
    }

    if (path.normalize(file_path).startsWith('..')) {
        res.status(400).send('Relative paths are not allowed');
        return;
    }

    const fileNames = fs.readdirSync(file_path, 'utf-8');
    res.json(fileNames);
});
export default router;
