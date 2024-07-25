import express from "express";
import multer from "multer";
import fs from "fs";
import os from "os";
import YAML from "yaml";
import sanitize from "string-sanitizer";
import { Client } from "@opensearch-project/opensearch";
import setRateLimit from "express-rate-limit";

const router = express.Router();
const upload = multer({ 
  dest: os.tmpdir()+'/',
  limits: { 
    fileSize: 50 * 1000 * 1000
  },
 })

 const rateLimit = setRateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests",
  headers: true,
  statusCode: 429,
})

 const sanitizeFilename = (filename) => {
  if(filename.includes('../')) {
    throw new Error('relative paths are not allowed')
  }
  
  return filename.replace('..', '');
 }

const HOST = process.env.OPENSEARCH_HOST || "host.docker.internal";
const PORT = process.env.OPENSEARCH_PORT || "9200";
const PROTOCOL = process.env.OPENSEARCH_PROTOCOL || "https";
const AUTH = process.env.OPENSEARCH_AUTH || "admin:admin";

function os_open_client() {
  const client = new Client({
    node: `${PROTOCOL}://${AUTH}@${HOST}:${PORT}`,
    ssl: { rejectUnauthorized: false },
  });
  return client;
}

export async function osPut(index_name, document) {
  const client = os_open_client();

  const response = await client.index({
    index: index_name,
    id: document.id,
    body: document,
    refresh: true,
  });
  return response;
}

export async function osDeleteIndex(index_name) {
  const client = os_open_client();
  const response = await client.indices.delete({
    index: index_name,
  });
  return response;
}

export async function osDeleteObject(index_name, obj_id) {
  const client = os_open_client();
  await client.delete({
    index: index_name,
    id: obj_id,
  });
}

function getInput(req) {
  if (req.file) {
    const inp = req.file.destination + req.file.filename;
    return YAML.parse(fs.readFileSync(sanitizeFilename(inp), "utf8"));
  } else {
    return YAML.parse(req.body.input);
  }
}

/*
	For intents, one entity per file
*/
router.post(
  "/put/:index_name/:index_type",
  upload.single("input"),
  rateLimit,
  (req, res) => {
    let input = getInput(req);

    if (input.nlu) input = input.nlu;

    if (input.data) input = input.data;

    const index_name = req.params.index_name;
    const index_type = req.params.index_type;

    const obj = input[0];

    if (index_type) {
      obj.id = obj[index_type].replaceAll(/\s+/g, "_");
    }

    osPut(index_name, obj)
      .then((ret) => {
        res.status(200);
        res.json(JSON.stringify(ret)).end();
      })
      .catch((e) => {
        res.status(500);
        console.error(e);
      });
  }
);

/*
	For config and domain - many different types of entities in one list 
*/
router.post("/bulk/:index_name", upload.single("input"), rateLimit, (req, res) => {
  const input = getInput(req);

  const index_name = req.params.index_name;

  for (let key in input) {
    if (key == "version") continue;
    const inp = {};
    inp[key] = input[key];
    inp.id = key;
    osPut(index_name, inp).catch(console.error);
  }
  res.end();
});

/*
	For rules, regexes and stories with one type of entities in a list
*/
router.post(
  "/bulk/:index_name/:index_type",
  upload.single("input"),
  rateLimit,
  (req, res) => {
    const input = getInput(req);

    const index_name = req.params.index_name;
    const index_type = req.params.index_type;

    input[index_name].forEach((obj) => {
      obj.id = sanitize.sanitize.addDash(obj[index_type]);
      osPut(index_name, obj).catch((e) => {
        res.status(500);
        res.end();
        console.error(e);
      });
    });
    res.status(200);
    res.end();
  }
);

router.post("/delete/:index_name", (req, res) => {
  const index_name = req.params.index_name;
  osDeleteIndex(index_name)
    .then((ret) => {
      res.status(200);
      res.json(JSON.stringify(ret)).end();
    })
    .catch((e) => {
      res.status(500);
      res.end();
      console.log(e);
    });
});

router.post("/delete/object/:index_name", (req, res) => {
  const index_name = req.params.index_name;
  const obj_id = req.body.id;

  osDeleteObject(index_name, obj_id)
    .then((ret) => {
      res.status(200);
      res.json(JSON.stringify(ret)).end();
    })
    .catch((e) => {
      res.status(500);
      res.end();
      console.log(e);
    });
});

router.post("/delete/:index_name/:obj_id", (req, res) => {
  const index_name = req.params.index_name;
  const obj_id = req.params.obj_id;

  osDeleteObject(index_name, obj_id)
    .then((ret) => {
      res.status(200);
      res.json(JSON.stringify(ret)).end();
    })
    .catch((e) => {
      res.status(500);
      res.end();
      console.log(e);
    });
});

export default router;
