import express from 'express';
import fs from 'fs';

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

    fs.access(filePath, (err) => {
        if (err) {
            console.error(err);
            res.json(false).send();
        } else {
            res.json(true).send();
        }
    });
});

export default router;
