import express from 'express';
import multer from 'multer';
import fs from 'fs';
import os from 'os';
import YAML from 'yaml';
import sanitize from 'string-sanitizer';

import { Client } from '@opensearch-project/opensearch';

const router = express.Router();
const upload = multer({ dest: os.tmpdir()+'/' })

const HOST = process.env.OPENSEARCH_HOST || "host.docker.internal"

function os_open_client() {
	var host = `${HOST}:9200`;
	var auth = "admin:admin"; 

	var client = new Client({
	  node: "https://" + auth + "@" + host,
	  ssl: { rejectUnauthorized: false },
	});
	return client;
}

export async function osPut(index_name, document) {
	var client = os_open_client();

 	var response = await client.index(
	{
	    index: index_name,
		id: document.id,
	    body: document,
	    refresh: true,
  	});
 	return response;
}

export async function osDeleteIndex(index_name) {
	var client = os_open_client();	
	var response = await client.indices.delete({
		index: index_name
	});
	return response;
}

export async function osDeleteObject(index_name, obj_id) {
	var client = os_open_client();
	var response = await client.delete({
		index: index_name,
		id: obj_id
	});
}

/*
	For intents, one entity per file
*/
router.post('/put/:index_name/:index_type', upload.single('input'), (req, res) =>  {
	var input;
	if (req.file) {
		var inp = req.file.destination+req.file.filename;
		input = YAML.parse(fs.readFileSync(inp, 'utf8'));
	} else {
		input = YAML.parse(req.body.input);
	}

	if (input.nlu)
		input = input.nlu;

	var index_name = req.params.index_name;
	var index_type = req.params.index_type;

	if (index_type) {
		var obj = input[0];
		obj.id = sanitize.sanitize.addDash(obj[index_type]);
	}

	osPut(index_name, obj)
		.then((ret) => {
			res.status(200);
			res.end(JSON.stringify(ret));
		})
		.catch( (e) => {
			res.status(500);
			console.log(e);
		});
});


/*
	For config and domain - many different types of entities in one list 
*/
router.post('/bulk/:index_name', upload.single('input'), (req,res) => { 
	var input;
	if (req.file) {
		var inp = req.file.destination+req.file.filename;
		input = YAML.parse(fs.readFileSync(inp, 'utf8'));
	} else {
		input = YAML.parse(req.body.input);
	}

	var index_name = req.params.index_name;


	for (let key in input) {	
		if (key == "version")
			continue;
		var inp = {};
		inp[key] = input[key];
		inp.id = key;
		osPut(index_name, inp);
	}
	res.end();
});

/*
	For rules, regexes and stories with one type of entities in a list
*/
router.post('/bulk/:index_name/:index_type', upload.single('input'), (req,res) => {
	var input;
	if (req.file) {
		var inp = req.file.destination+req.file.filename;
		input = YAML.parse(fs.readFileSync(inp, 'utf8'));
	} else {
		input = YAML.parse(req.body.input);
	}

	var index_name = req.params.index_name;
	var index_type = req.params.index_type;

	input[index_name].forEach( (obj) => {
		obj.id = sanitize.sanitize.addDash(obj[index_type]);
		osPut(index_name, obj)
			.catch( (e) => {
				res.status(500);
				res.end();
				console.log(e);
			});
		});
	res.status(200);
	res.end();	
});

router.post('/delete/:index_name', (req,res) => {
	var index_name = req.params.index_name;
	osDeleteIndex(index_name).then( (ret) => {
		res.status(200);
		res.end(JSON.stringify(ret));
	})
	.catch( (e) => {
		res.status(500);
		res.end();
		console.log(e);
	});

})

router.post('/delete/:index_name/:obj_id', (req, res) => {
	var index_name = req.params.index_name;
	var obj_id = req.params.obj_id;

	osDeleteObject(index_name, obj_id).then((ret) => {
		res.status(200);
		res.end(JSON.stringify(ret));
	}).catch( (e) => {
		res.status(500);
		res.end();
		console.log(e);
	});
});

export default router;