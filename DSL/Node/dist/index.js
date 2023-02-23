"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const convert_1 = __importDefault(require("./convert"));
const file_1 = __importDefault(require("./file"));
const merge_1 = __importDefault(require("./merge"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json()); // to support JSON-encoded bodies
app.use(express_1.default.urlencoded());
app.use('/convert', convert_1.default);
app.use('/file', file_1.default);
app.use('/merge', merge_1.default);
const pathToHbs = '/home/raul/buerokratt/Training-Module/DSL/DMapper/';
handlebars_1.default.registerHelper('toJSON', function (obj) {
    return JSON.stringify(obj);
});
handlebars_1.default.registerHelper('eq', (a, b) => a == b);
app.post('/dmapper/:filename', (req, res) => {
    const { filename } = req.params;
    const file = fs_1.default.readFileSync(pathToHbs + filename.replace(/-/g, '_') + '.hbs', 'utf8');
    let template = handlebars_1.default.compile(file);
    res.header('Content-Type', 'application/json');
    console.log(req.body);
    res.send(template(req.body));
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
