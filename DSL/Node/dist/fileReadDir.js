"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
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
    const fileNames = fs_1.default.readdirSync(file_path, 'utf-8');
    res.json(fileNames);
});
exports.default = router;
