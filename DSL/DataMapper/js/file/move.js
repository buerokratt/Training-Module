import path from 'path';
import fs from 'fs';
import { buildContentFilePath, isValidFilePath } from '../util/utils.js';

export default async function moveFile(current_path, new_path) {
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
    fs.renameSync(currentPath, newPath)

    return {
      error: false,
      message: 'File moved successfully'
    }
  } catch (err) {
    return {
      error: true,
      message: 'Unable to move file',
    }
  }
}
