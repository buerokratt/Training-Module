import express from "express";
import getAllSecrets from "../js/secrets/get-all.js";
import getSecretsWithPriority from "../js/secrets/get-with-priority.js";

const router = express.Router();

router.post("/get-all", async (req, res) => {
  const secrets = await getAllSecrets();
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ ...secrets });
});

router.post("/get-with-priority", async (req, res) => {
  const priority = req.query.priority;
  const result = await getSecretsWithPriority(priority);
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ ...result });
});

export default router;
