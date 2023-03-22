"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    const { array, value } = req.body;
    console.log(req.body);
    if (!array || !value) {
        res.status(400).send('Both array and value are required');
        return;
    }
    const filteredArray = array.filter(function (e) {
        return e !== value;
    });
    res.json(filteredArray);
});
exports.default = router;
