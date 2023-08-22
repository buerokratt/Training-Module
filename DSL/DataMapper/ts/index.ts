import express, { Express } from 'express';
import merge from './merge';
import validate from './validate';
import yamlToJson from "./yamlToJson";
import jsonToYaml from "./jsonToYaml";
import csvToJson from "./csvToJson";
import stringSplit from "./stringSplit";
import stringReplace from "./stringReplace";
import fileRead from "./fileRead";
import fileWrite from "./fileWrite";
import fileDelete from "./fileDelete";
import fileCheck from "./fileCheck";
import mergeObjects from "./mergeObjects";
import mergeRemoveKey from "./mergeRemoveKey";
import mergeRemoveArrayValue from "./mergeRemoveArrayValue";
import mergeReplaceArrayElement from "./mergeReplaceArrayElement";
import dmapper from './dmapper';
import fileReadDir from "./fileReadDir";
import removeRulesByIntentName from "./removeRulesByIntentName";
import domainUpdateExistingResponse from "./domainUpdateExistingResponse";

const app: Express = express();
const port = 3000

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use('/file/read', fileRead);
app.use('/file/read-directory', fileReadDir);
app.use('/file/write', fileWrite);
app.use('/file/delete', fileDelete);
app.use('/file/check', fileCheck);
app.use('/merge', merge);
app.use('/merge/objects', mergeObjects);
app.use('/merge/remove-key', mergeRemoveKey);
app.use('/merge/remove-array-value', mergeRemoveArrayValue);
app.use('/merge/replace-array-element', mergeReplaceArrayElement);
app.use('/validate/array-elements-length', validate);
app.use('/convert/yaml-to-json', yamlToJson)
app.use('/convert/json-to-yaml', jsonToYaml)
app.use('/convert/csv-to-json', csvToJson)
app.use('/convert/string/split', stringSplit)
app.use('/convert/string/replace', stringReplace)
app.use('/dmapper', dmapper);
app.use('/rules/remove-by-intent-name', removeRulesByIntentName);
app.use('/domain/update-existing-response', domainUpdateExistingResponse)

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
