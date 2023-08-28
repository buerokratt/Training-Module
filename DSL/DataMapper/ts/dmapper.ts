import express, { Request, Response, Router } from 'express';
import Handlebars from "handlebars";
import fs from "fs";

const router: Router = express.Router();
const pathToHbs = '/DSL/DMapper/';

Handlebars.registerHelper('toJSON', function(obj) {
    return JSON.stringify(obj);
});
Handlebars.registerHelper('eq', (a, b) => a == b)
Handlebars.registerHelper('assign', function (varName, varValue, options) {
    if (!options.data.root) {
        options.data.root = {};
    }
    options.data.root[varName] = varValue;
});

Handlebars.registerHelper('isInModel', function (intentTitle: string, data: any): boolean {
    const inModelIntents = data?.response?.inmodel?.response?.intents;
    return Array.isArray(inModelIntents) ? inModelIntents.includes(intentTitle) : false;
});

router.post('/:filename', (req: Request, res: Response) => {
    const { filename } = req.params;
    const type = req.header('type')
    const file = fs.readFileSync(pathToHbs + filename.replace(/-/g,'_') +'.hbs', 'utf8')
    const data = req.body;

    let template = Handlebars.compile(file);
    if (type == 'csv') {
        res.json({response: template(req.body)});
    } else {
        res.setHeader('Content-Type', 'application/json')
        res.send(template({ data: req.body }));
    }
})

export default router;
