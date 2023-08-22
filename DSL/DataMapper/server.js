import express from "express";
import { create } from "express-handlebars";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import secrets from "./controllers/secrets.js";
import fs from "fs";
import files from "./controllers/files.js";
import crypto from "crypto";

import encryption from "./controllers/encryption.js";
import decryption from "./controllers/decryption.js";
import * as path from "path";
import { fileURLToPath } from "url";
import sendMockEmail from "./js/email/sendMockEmail.js";
import { generatePdf } from "./js/generate/pdf.js";
import { generatePdfToBase64 } from "./js/generate/pdfToBase64.js";
import { generateHTMLTable } from "./js/convert/pdf.js";
import * as helpers from "./lib/helpers.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const PORT = process.env.PORT || 3000;
const app = express();
const hbs = create({ helpers });
app.use(express.json());
app.use("/file-manager", files);
app.use(express.urlencoded({ extended: true }));
app.use(
  "/encryption",
  encryption({
    publicKey: publicKey,
    privateKey: privateKey,
  })
);
app.use(
  "/decryption",
  decryption({
    publicKey: publicKey,
    privateKey: privateKey,
  })
);

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use("/secrets", secrets);
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.post("/hbs/*", (req, res) => {
  res.render(req.params[0], req.body, function (_, response) {
    if (req.get("type") === "csv") {
      res.json({ response });
    } else if (req.get("type") === "json") {
      res.json(JSON.parse(response));
    }
  });
});

app.post("/js/convert/pdf", (req, res) => {
  const filename = "chat-history";
  const template = fs
    .readFileSync(__dirname + "/views/pdf.handlebars")
    .toString();
  const dom = new JSDOM(template);
  generateHTMLTable(
    req.body.data,
    dom.window.document.getElementById("chatHistoryTable")
  );
  generatePdfToBase64(dom.window.document.documentElement.innerHTML, res);
});

app.post("/js/generate/pdf", (req, res) => {
  const filename = req.body.filename;
  const template = req.body.template;

  generatePdf(filename, template, res);
});

app.get("/js/*", (req, res) => {
  res.send(fs.readFileSync(__dirname + req.path + ".js").toString());
});

app.post("/example/post", (req, res) => {
  console.log(`POST endpoint received ${JSON.stringify(req.body)}`);
  res.status(200).json({ message: `received value ${req.body.name}` });
});

app.listen(PORT, () => {
  console.log("Nodejs server running on http://localhost:%s", PORT);
});
