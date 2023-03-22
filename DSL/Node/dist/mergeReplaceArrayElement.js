"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    const { array, element, newValue } = req.body;
    console.log(req.body);
    if (!array || !element || !newValue) {
        res.status(400).send('Array, element and newValue are required');
        return;
    }
    const index = array.indexOf(element);
    if (index == -1) {
        res.status(400).send("Array element {element} is missing");
        return;
    }
    array[index] = newValue;
    res.json(array);
});
exports.default = router;
