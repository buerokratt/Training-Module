"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
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
    fs_1.default.access(filePath, (err) => {
        if (err) {
            console.error(err);
            res.json(false);
        }
        else {
            res.json(true);
        }
    });
});
exports.default = router;
