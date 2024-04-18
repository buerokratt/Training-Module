import replace from 'replace-in-file';
import { buildContentFilePath, isValidFilePath } from '../util/utils.js';

export default async function editFile(file_path, from, to) {
  if (!isValidFilePath(file_path)) {
    return {
      error: true,
      message: 'File path contains illegal characters',
    }
  }

  if (!from && !to) {
    return {
      error: true,
      message: '\"from\" & \"to\" are required',
    }
  }

  try {
    const filepath = buildContentFilePath(file_path)
    await replace({
      files: filepath,
      from: from,
      to: to,
    })

    return {
      error: false,
      message: 'File edited successfully',
    }
  } catch (err) {
    return {
      error: true,
      message: 'Unable to edit file',
    }
  }
}
