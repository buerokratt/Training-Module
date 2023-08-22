import fs from 'fs';
import { buildContentFilePath, isValidFilePath } from '../util/utils.js';

export default async function deleteFile(file_path) {
  if (!isValidFilePath(file_path)) {
    return {
      error: true,
      message: 'File path contains illegal characters',
    }
  }

  try {
    const filepath = buildContentFilePath(file_path)
    fs.unlinkSync(filepath)

    return {
      error: false,
      message: 'File deleted successfully',
    }
  } catch (err) {
    return {
      error: true,
      message: 'Unable to delete file',
    }
  }
}
