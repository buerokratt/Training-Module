import express from 'express';
import checkIfFileExists from '../js/file/exists.js';
import createFile from '../js/file/create.js';
import moveFile from '../js/file/move.js';
import copyFile from '../js/file/copy.js';
import deleteFile from '../js/file/delete.js';
import readFile from '../js/file/read.js';
import editFile from '../js/file/edit.js';

const router = express.Router();

router.post('/exists', async (req, res) => {
  const result = await checkIfFileExists(req.body.file_path, req.body.content)
  return res.status(result.error ? 400 : 200).json(result)
})

router.post('/create', async (req, res) => {
  const result = await createFile(req.body.file_path, req.body.content)
  return res.status(result.error ? 400 : 200).json(result)
})

router.post('/move', async (req, res) => {
  const result = await moveFile(req.body.file_path, req.body.new_path)
  return res.status(result.error ? 400 : 200).json(result)
})

router.post('/copy', async (req, res) => {
  const result = await copyFile(req.body.file_path, req.body.new_path)
  return res.status(result.error ? 400 : 200).json(result)
})

router.post('/delete', async (req, res) => {
  const result = await deleteFile(req.body.file_path)
  return res.status(result.error ? 400 : 200).json(result)
})

router.post('/read', async (req, res) => {
  const result = await readFile(req.body.file_path)
  return res.status(result.error ? 400 : 200).json(result)
})

router.post('/edit', async (req, res) => {
  const result = await editFile(req.body.file_path, req.body.from, req.body.to)
  return res.status(result.error ? 400 : 200).json(result)
})

export default router;
