"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
router.post('/read', (req, res) => {
    const file_path = req.body.file_path;
    if (!file_path) {
        res.status(400).send('File path is required');
        return;
    }
    if (path_1.default.normalize(file_path).startsWith('..')) {
        res.status(400).send('Relative paths are not allowed');
        return;
    }
    fs_1.default.readFile(file_path, 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }
        const file = Buffer.from(data).toString('base64');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ file }));
    });
});
router.post('/write', (req, res) => {
    const { file_path, content } = req.body;
    if (!file_path || !content) {
        res.status(400).send('Filename and content are required');
        return;
    }
    if (path_1.default.normalize(file_path).startsWith('..')) {
        res.status(400).send('Relative paths are not allowed');
        return;
    }
    fs_1.default.writeFile(file_path, content, (err) => {
        if (err) {
            res.status(500).send('Unable to save file');
            return;
        }
        res.status(201).send('File saved successfully');
    });
});
exports.default = router;
