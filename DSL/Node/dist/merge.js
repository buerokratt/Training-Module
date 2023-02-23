"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lodash_1 = __importDefault(require("lodash"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    console.log(req.body);
    const { array1, array2, iteratee } = req.body;
    if (!array1 || !array2) {
        res.status(400).send('Both arrays are required');
        return;
    }
    const merged = lodash_1.default.unionBy(array2, array1, iteratee);
    res.json(merged);
});
exports.default = router;
