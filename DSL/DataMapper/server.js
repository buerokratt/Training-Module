import express from "express";
import { create } from "express-handlebars";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import secrets from "./controllers/secrets.js";
import fs from "fs";
import files from "./controllers/files.js";
import mapper from "./controllers/mapper.js";
import crypto from "crypto";

import encryption from "./controllers/encryption.js";
import decryption from "./controllers/decryption.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { generatePdf } from "./js/generate/pdf.js";
import { generatePdfToBase64 } from "./js/generate/pdfToBase64.js";
import { generateHTMLTable } from "./js/convert/pdf.js";
import helpers from "./lib/helpers.js";
import fileRead from "./js/file/fileRead.js";
import fileReadDir from "./js/file/fileReadDir.js";
import fileWrite from "./js/file/fileWrite.js";
import fileDelete from "./js/file/delete.js";
import deleteIntentFile from "./js/file/deleteIntentFile.js";
import fileCheck from "./js/file/fileCheck.js";
import merge from "./js/util/merge.js";
import formDetails from "./js/forms/getFormDetailedInformation.js";
import mergeObjects from "./js/util/mergeObjects.js";
import mergeRemoveKey from "./js/util/mergeRemoveKey.js";
import mergeRemoveArrayValue from "./js/util/mergeRemoveArrayValue.js";
import mergeReplaceArrayElement from "./js/util/mergeReplaceArrayElement.js";
import validate from "./js/util/arrayElementsLength.js";
import yamlToJson from "./js/convert/yamlToJson.js";
import jsonToYaml from "./js/convert/jsonToYaml.js";
import jsonToYamlStories from "./js/convert/jsonToYamlStories.js";
import csvToJson from "./js/convert/csvToJson.js";
import stringSplit from "./js/util/stringSplit.js";
import stringToArray from "./js/util/stringToArray.js";
import stringReplace from "./js/util/stringReplace.js";
import removeRulesByIntentName from "./js/util/removeRulesByIntentName.js";
import domainUpdateExistingResponse from "./js/util/domainUpdateExistingResponse.js";
import replaceKeyValueObj from "./js/util/updateKeyValueObj.js";
import objectListContainsId from "./js/util/objectListContainsId.js";
import validateStoriesRules from "./js/validation/validateStoriesRules.js";
import replaceNextElementInArray from "./js/util/replaceNextElementInArray.js";
import updateParametersByKey from "./js/docker/updateParametersByKey.js";
import createExpressionFromDateDays from "./js/cron/createExpressionFromDateDays.js";
import incrementDoubleDigitStringVersion from "./js/util/incrementDoubleDigitStringVersion.js";
import updateVersionForBot from "./js/docker/updateVersionForBot.js";
import botTrainedVersion from "./js/docker/botTrainedVersion.js";
import removeServicesConnectedToIntent from "./js/util/removeServicesConnectedToIntent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const PORT = process.env.PORT || 3000;
const app = express();
const hbs = create({ helpers });

app.use(express.json());
app.use("/file-manager", files);
app.use("/file/read", fileRead);
app.use("/file/read-directory", fileReadDir);
app.use("/file/write", fileWrite);
app.use("/file/delete", fileDelete);
app.use("/file/delete-intent", deleteIntentFile);
app.use("/file/check", fileCheck);
app.use("/merge", merge);
app.use("/forms/detailed-information", formDetails);
app.use("/merge/objects", mergeObjects);
app.use("/replace/key-value-in-obj", replaceKeyValueObj);
app.use("/merge/remove-key", mergeRemoveKey);
app.use("/merge/remove-array-value", mergeRemoveArrayValue);
app.use("/merge/replace-array-element", mergeReplaceArrayElement);
app.use("/validate/array-elements-length", validate);
app.use("/convert/yaml-to-json", yamlToJson);
app.use("/convert/json-to-yaml", jsonToYaml);
app.use("/convert/json-to-yaml-stories", jsonToYamlStories);
app.use("/convert/csv-to-json", csvToJson);
app.use("/convert/string/split", stringSplit);
app.use("/convert/string/replace", stringReplace);
app.use("/convert/string/toArray", stringToArray);
app.use("/rules/remove-by-intent-name", removeRulesByIntentName);
app.use("/array/replace-next-element", replaceNextElementInArray);
app.use("/docker/update-parameter-by-key", updateParametersByKey);
app.use("/docker/update-version-for-bot", updateVersionForBot);
app.use("/docker/bot-trained-version", botTrainedVersion);
app.use("/cron/generate-expression-date-days", createExpressionFromDateDays);
app.use("/domain/update-existing-response", domainUpdateExistingResponse);
app.use("/util/objectListContainsId", objectListContainsId);
app.use(
  "/util/increase-double-digit-version",
  incrementDoubleDigitStringVersion
);
app.use("/validate/validate-stories-rules", validateStoriesRules);
app.use(
  "/filter_out_services_connected_to_intent",
  removeServicesConnectedToIntent
);
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
app.use("/dmapper", mapper);

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
