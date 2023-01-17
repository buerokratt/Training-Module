export interface ResultBundle {
  name: string;
  files: {
    fileName: string;
    lastModified: string;
    fileUri: string;
  }[];
}
