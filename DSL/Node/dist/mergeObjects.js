"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    const { object1, object2 } = req.body;
    console.log(req.body);
    if (!object1 || !object2) {
        res.status(400).send('Both objects are required');
        return;
    }
    res.json(Object.assign(Object.assign({}, object1), object2));
});
exports.default = router;
