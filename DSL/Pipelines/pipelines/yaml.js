import express from 'express';
import multer from 'multer';
import fs from 'fs';
import YAML from 'yaml';
import os from 'os';

const router = express.Router();
const upload = multer({ dest: os.tmpdir()+'/' })

export function yaml2obj(input) {
	return YAML.parse(input);
}

export function obj2yaml(input) {
	return YAML.stringify(input);
}

export function json2yaml(input) {
	return obj2yaml(JSON.parse(input));
}

router.post('/yaml', upload.single('input'), (req, res) => {	
	var input;
	if (req.file) {
		var inp = req.file.destination+req.file.filename;
		var out = req.file.originalname.replace(/ya?ml/, "json")
		input = fs.readFileSync(inp, 'utf8');
	} else {
		input = req.body.input;
	}

	var output = yaml2obj(input);
	if (output.nlu)
		output = output.nlu;

	res.attachment(out)
		.type('json')
		.send(output);
});

router.post('/json', upload.single('input'), (req, res) => {
	var input;
	if (req.file) {
		var inp = req.file.destination+req.file.filename;
		var out = req.file.originalname.replace(/json/, "yaml")
		input = fs.readFileSync(inp, 'utf8');
	} else {
		input = req.body.input;
	}	
	res.attachment(out)
		.type('yaml')
		.send(json2yaml(input));	
});

export default router;