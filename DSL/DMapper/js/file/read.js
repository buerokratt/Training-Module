import fs from 'fs';
import { buildContentFilePath, isValidFilePath } from '../util/utils.js';

export default async function readFile(file_path) {
  if (!isValidFilePath(file_path)) {
    return {
      error: true,
      message: 'File name contains illegal characters',
    }
  }

  try {
    const filepath = buildContentFilePath(file_path)
    const data = fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' })

    return {
      error: false,
      message: 'file readed successfully',
      data: data
    }
  } catch (err) {
    return {
      error: true,
      message: 'Unable to read file',
    }
  }
}
