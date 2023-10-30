import fs from 'fs';
import express from "express";
import path from "path";

const router = express.Router();

function customIsValidFilePath(file_path) {
    const illegalCharacterPattern = /[\\?%*:|"<>.]/;
    return illegalCharacterPattern.test(file_path);
}

function customBuildContentFilePath(file_path) {
    return path.join(process.env.CONTENT_FOLDER || "", file_path);
}

router.post('/', (req, res) => {
    const filePath = req.body.file_path;
    const deletePath = customBuildContentFilePath(filePath);

    if (!customIsValidFilePath(filePath)) {
        return res.status(400).json({
            error: true,
            message: 'File path contains illegal characters',
        }).send("File path contains illegal characters");
    }

    fs.unlink(deletePath, (err) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: 'Unable to delete file',
            }).send("Error deleting file");
        }

        return res.status(200).json({
            error: false,
            message: 'File deleted successfully',
        }).send("Success deleting file");
    });
});

export default router;
