"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    let { data, separator } = req.body;
    res.send(data.split(separator).filter(function (n) { return n; })); // filter removes empty array elements.
});
exports.default = router;
