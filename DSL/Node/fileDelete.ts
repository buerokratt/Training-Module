import express, { Router } from 'express';
import path from "path";
import fs from "fs";
const router: Router = express.Router();

router.post('/', (req, res) => {
    const filePath = req.body.file_path;

    if (!filePath) {
        res.status(400).send('Filename is required');
        return;
    }

    if (path.normalize(filePath).startsWith('..')) {
        res.status(400).send('Relative paths are not allowed');
        return;
    }
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting file');
            return;
        }
        res.status(200).send('File deleted successfully');
    });
});
export default router;
