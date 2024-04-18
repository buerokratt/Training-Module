import path from 'path';
import fs from 'fs';
import { buildContentFilePath, isValidFilePath } from '../util/utils.js';

export default async function copyFile(current_path, new_path) {
  if (!isValidFilePath(current_path) || !isValidFilePath(new_path)) {
    return {
      error: true,
      message: 'path contains illegal characters',
    }
  }


  try {
    const currentPath = buildContentFilePath(current_path)
    const newPath = buildContentFilePath(new_path)

    fs.mkdirSync(path.dirname(newPath), { recursive: true })
    fs.copyFileSync(currentPath, newPath)

    return {
      error: false,
      message: 'File copied successfully'
    }
  } catch (err) {
    return {
      error: true,
      message: 'Unable to copy file',
    }
  }
}
