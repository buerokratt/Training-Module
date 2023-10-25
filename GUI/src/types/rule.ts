import {ResponseData} from "./response";

export interface Rule {
  id: string;
  steps: string | string[]
}

export interface Rules {
  response: Rule[];
}
