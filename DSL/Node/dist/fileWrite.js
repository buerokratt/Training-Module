"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    const { file_path, content } = req.body;
    if (!file_path || !content) {
        res.status(400).send('Filename and content are required');
        return;
    }
    if (file_path.includes('..')) {
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
