"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const pathToHbs = '/DSL/DMapper/';
handlebars_1.default.registerHelper('toJSON', function (obj) {
    return JSON.stringify(obj);
});
handlebars_1.default.registerHelper('eq', (a, b) => a == b);
handlebars_1.default.registerHelper('assign', function (varName, varValue, options) {
    if (!options.data.root) {
        options.data.root = {};
    }
    options.data.root[varName] = varValue;
});
router.post('/:filename', (req, res) => {
    const { filename } = req.params;
    const type = req.header('type');
    const file = fs_1.default.readFileSync(pathToHbs + filename.replace(/-/g, '_') + '.hbs', 'utf8');
    let template = handlebars_1.default.compile(file);
    if (type == 'csv') {
        res.json({ response: template(req.body) });
    }
    else {
        res.setHeader('Content-Type', 'application/json');
        res.send(template(req.body));
    }
});
exports.default = router;
