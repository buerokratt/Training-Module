"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    const { rulesJson, searchIntentName } = req.body;
    const strRegExPattern = ".*\\b" + searchIntentName + "\\b.*";
    const regExp = RegExp(strRegExPattern);
    const result = rulesJson
        .map((entry) => {
        const containsSearchTerm = regExp.test(JSON.stringify(entry));
        if (!containsSearchTerm)
            return entry;
    })
        .filter(value => value);
    return res.status(200).send({ result });
});
exports.default = router;
