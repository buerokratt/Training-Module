import express from "express";
import aesDecrypt from "../js/decryption/aes.js";
import tripleDesDecrypt from "../js/decryption/triple-des.js";
import base64Decrypt from "../js/decryption/base64.js";
import rsaDecrypt from "../js/decryption/rsa.js";

var wrapper = function (config) {
  const router = express.Router();

  router.post("/aes", async (req, res) => {
    const result = await aesDecrypt(
      req.body.cipher,
      req.body.key,
      req.body.isObject
    );
    return res.status(result.error ? 400 : 200).json(result);
  });

  router.post("/triple-des", async (req, res) => {
    const result = await tripleDesDecrypt(
      req.body.cipher,
      req.body.key,
      req.body.isObject
    );
    return res.status(result.error ? 400 : 200).json(result);
  });

  router.post("/base64", async (req, res) => {
    const result = await base64Decrypt(req.body.cipher, req.body.isObject);
    return res.status(result.error ? 400 : 200).json(result);
  });

  router.post("/rsa", async (req, res) => {
    const result = await rsaDecrypt(req.body.cipher, config.privateKey);
    return res.status(result.error ? 400 : 200).json(result);
  });
  return router;
};

export default wrapper;
