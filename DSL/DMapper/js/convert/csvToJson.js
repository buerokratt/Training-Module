import express from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import fs from 'fs';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.body.file) {
        return res.status(400).json({ error: "No file uploaded" }).send();
    }
    const fileContent = Object.values(req.body.file)[0];
    const result = Papa.parse(fileContent, { skipEmptyLines: true });
    const csvData = result.data;
    res.json(csvData);
});

export default router;
