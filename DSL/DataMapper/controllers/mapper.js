import express from 'express';
import Handlebars from 'handlebars';
import fs from "fs";
import helpers from "../lib/helpers.js";

// For running on docker:
const pathToHbs = '/usr/src/app/views/training/'

// For running on local:
// const pathToHbs = "DSL/DataMapper/views/training/";

const router = express.Router();

router.post('/:filename', function(req, res) {
    //console.log("INCOMING: \n - - - - - - \n" + JSON.stringify(req.body) + "\n - - - - - - \n");
    const { filename } = req.params;
    const type = req.header('type');
    const file = fs.readFileSync(pathToHbs + filename.replace(/-/g, '_') + '.hbs', 'utf8');
    //const data = req.body;

    const template = Handlebars.compile(file, { helpers });
    const templateResult = template(req.body);
    //console.log("CREATED TEMPLATE: \n - - - - - - \n" + templateResult + "\n - - - - - - \n");
    const templateObject = JSON.parse(templateResult);

    if (type == 'csv') {
        res.json({ response: templateObject });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.send({ data: templateObject });
    }
});

export default router;
