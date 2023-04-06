"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    const { json, searchKey, newKey, newKeyValue } = req.body;
    if (!json || !searchKey || !newKey || !newKeyValue) {
        return res.status(400).send('json, searchKey, newKey, newKeyValue are required fields');
    }
    Object.entries(json).map(([key, _]) => {
        if (key.includes(searchKey)) {
            json[newKey] = [{
                    text: newKeyValue,
                }];
            delete json[key];
        }
    });
    return res.status(200).send(json);
});
exports.default = router;
