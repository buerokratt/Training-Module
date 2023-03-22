"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    const { object, key } = req.body;
    console.log(req.body);
    if (!object || !key) {
        res.status(400).send('Both object and key are required');
        return;
    }
    delete object[key];
    res.json(object);
});
exports.default = router;
