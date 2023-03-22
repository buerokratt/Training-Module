"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const router = express_1.default.Router();
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
    const mimeType = mime_types_1.default.lookup(file_path);
    const name = file_path.split(/(\\|\/)/g).pop();
    fs_1.default.readFile(file_path, 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }
        const file = Buffer.from(data).toString('base64');
        res.setHeader('Content-Type', 'application/json');
        const result = {
            name: name,
            file: file,
            mimeType: mimeType
        };
        res.json(result);
    });
});
exports.default = router;
