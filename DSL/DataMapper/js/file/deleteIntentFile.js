import fs from 'fs';
import express from "express";
import path from "path";

const router = express.Router();

function customIsValidFilePath(file_path) {
    const illegalCharacterPattern = /[\\?%*:|"<>.]/;

    //switched this
    //make sure is correct
    return illegalCharacterPattern.test(file_path);
}

function customBuildContentFilePath(file_path) {
    return path.join(process.env.CONTENT_FOLDER || "", file_path);
}

router.post('/', (req, res) => {
    const filePath = req.body.file_path;
    console.log('a FILE PATH: ' + filePath);

    const deletePath = customBuildContentFilePath(filePath);
    console.log('\nb DELETE PATH: ' + deletePath);

    if (!customIsValidFilePath(filePath)) {
        return res.status(400).json({
            error: true,
            message: 'File path contains illegal characters',
        }).send();
    }

    console.log('\nc TRYING UNLINK ');
    fs.unlink(deletePath, (err) => {
        if (err) {
            console.log('Error deleting file:', err);
            return res.status(500).json({
                error: true,
                message: 'Unable to delete file',
            }).send();
        }

        console.log('File deleted successfully');
        return res.status(200).json({
            error: false,
            message: 'File deleted successfully',
        }).send();
    });
});

export default router;
