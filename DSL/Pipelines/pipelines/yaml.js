import express from 'express';
import multer from 'multer';
import fs from 'fs';
import YAML from 'yaml';
import os from 'os';
import sanitizeFilename from "sanitize-filename";

const router = express.Router();
const upload = multer({ 
  dest: os.tmpdir()+'/',
  limits: { 
    fileSize: 50 * 1000 * 1000
  },
 })

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
	let input;
	if (req.file) {
		const inp = req.file.destination+req.file.filename;
		input = fs.readFileSync(sanitizeFilename(inp), 'utf8');
	} else {
		input = req.body.input;
	}

	let output = yaml2obj(input);
	if (output.nlu)
		output = output.nlu;

	res.attachment(out)
		.type('json')
		.send(output);
});

router.post('/json', upload.single('input'), (req, res) => {
	let input;
	if (req.file) {
		const inp = req.file.destination+req.file.filename;
		input = fs.readFileSync(sanitizeFilename(inp), 'utf8');
	} else {
		input = req.body.input;
	}	
	res.attachment(out)
		.type('yaml')
		.send(json2yaml(input));	
});

export default router;
