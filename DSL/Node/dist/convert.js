"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const yaml_1 = require("yaml");
const papaparse_1 = __importDefault(require("papaparse"));
const router = express_1.default.Router();
router.post('/yaml-to-json', (0, multer_1.default)().array('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const file = base64ToText(req.body.file);
    let result = (0, yaml_1.parse)(file);
    res.send(result);
}));
router.post('/json-to-yaml', (0, multer_1.default)().array('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let result = (0, yaml_1.stringify)(req.body);
    res.json({ "json": result });
}));
function base64ToText(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    return buffer.toString('utf-8');
}
router.post('/csv-to-json', (0, multer_1.default)().array('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const file = base64ToText(req.body.file);
    let result = papaparse_1.default.parse(file);
    res.send(result.data);
}));
exports.default = router;
