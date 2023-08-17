import path from "path";
import fs from "fs";
import { parse as parseYmlToJson } from "yaml";

export const assignSecrets = (data, result) => {
  Object.keys(data).forEach((k) => {
    if (typeof data[k] === "object") {
      result[k] = {};
      return assignSecrets(data[k], result[k]);
    }
    result[k] = data[k];
  });
};

export const mapSecretToJson = (secrets) => {
  const result = {};
  secrets.forEach((secretPath) => {
    try {
      const data = parseYmlToJson(fs.readFileSync(secretPath, "utf-8"));
      assignSecrets(data, result);
    } catch (_) {
      return {};
    }
  });
  return result;
};

export const buildContentFilePath = (fileName) => {
  return path.join(process.env.CONTENT_FOLDER || "data", fileName);
};

export const isValidFilename = (fileName) => {
  return fileName && RegExp("^[0-9a-zA-Z-._/]+$").test(fileName);
};

export const isValidFilePath = (filePath) => {
  return (
    filePath &&
    isValidFilename(filePath) &&
    path.normalize(filePath).includes("..") === false
  );
};

export const getAllFiles = function (dirPath) {
  const folder = path.join(process.env.CONTENT_FOLDER || "data", dirPath);
  return getAllFilesInsideFolder(folder);
};

const getAllFilesInsideFolder = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFilesInsideFolder(
        dirPath + "/" + file,
        arrayOfFiles
      );
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

export const readFile = function (filePath) {
  const data = fs.readFileSync(filePath, { encoding: "utf8" });
  return Buffer.from(data).toString();
};
