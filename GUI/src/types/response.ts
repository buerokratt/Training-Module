export interface ResponseDataResponse {
  text: string;
  condition?: Condition[];
}

export interface Condition {
  type: string;
  name: string;
  value: null;
}

interface ResponseDataEdit {
  [key: string]: ResponseDataResponse[];
}

export interface ResponseEdit {
  response_name: string;
  response: ResponseDataEdit;
  intent?: string;
}

export interface Response {
  response: string;
  text: string;
  rules: string[];
  stories: string[];
}
