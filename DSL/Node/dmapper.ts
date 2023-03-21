import express, {Request, Response, Router} from 'express';

import Handlebars from "handlebars";
import fs from "fs";
const router: Router = express.Router();
const pathToHbs = '/home/raul/buerokratt/Training-Module/DSL/DMapper/';
Handlebars.registerHelper('toJSON', function(obj) {
    return JSON.stringify(obj);
});
Handlebars.registerHelper('eq', (a, b) => a == b)
router.post('/:filename', (req: Request, res: Response) => {
    const { filename } = req.params;
    const type = req.header('type')
    const file = fs.readFileSync(pathToHbs + filename.replace(/-/g,'_') +'.hbs', 'utf8')
    let template = Handlebars.compile(file);
    console.log(req.body);
    if (type == 'csv') {
        res.json({response: template(req.body)});
    } else {
        res.send(template(req.body));
    }
})

export default router;
