"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    const { array, length } = req.body;
    if (!array || !length) {
        res.status(400).send('Both array and length parameters are required');
        return;
    }
    res.json(array.every((value) => value.length <= length));
});
exports.default = router;
