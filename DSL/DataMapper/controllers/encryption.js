import express from "express";
import aesEncrypt from "../js/encryption/aes.js";
import tripleDesEncrypt from "../js/encryption/triple-des.js";
import base64Encrypt from "../js/encryption/base64.js";
import rsaEncrypt from "../js/encryption/rsa.js";

var wrapper = function (config) {
  const router = express.Router();

  router.post("/aes", async (req, res) => {
    const result = await aesEncrypt(req.body.content, req.body.key);
    return res.status(result.error ? 400 : 200).json(result);
  });

  router.post("/triple-des", async (req, res) => {
    const result = await tripleDesEncrypt(req.body.content, req.body.key);
    return res.status(result.error ? 400 : 200).json(result);
  });

  router.post("/base64", async (req, res) => {
    const result = await base64Encrypt(req.body.content);
    return res.status(result.error ? 400 : 200).json(result);
  });

  router.post("/rsa", async (req, res) => {
    const result = await rsaEncrypt(req.body.content, config.publicKey);
    return res.status(result.error ? 400 : 200).json(result);
  });

  return router;
};

export default wrapper;
