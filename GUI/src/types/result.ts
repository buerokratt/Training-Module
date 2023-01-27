export interface ResultBundle {
  name: string;
  files: ResultFile[];
}

export interface ResultFile {
  fileName: string;
  lastModified: string;
  fileUri: string;
}
