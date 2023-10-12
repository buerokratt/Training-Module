export interface Responses {
    response: ResponseData[];
}
export interface ResponseData {
    name:     string;
    response: ResponseDataResponse[];
}
export interface ResponseDataResponse {
    text:       string;
    condition?: Condition[];
}
export interface Condition {
    type:  string;
    name:  string;
    value: null;
}

export interface ResponseDataEdit {
    [key: string]: ResponseDataResponse[]
}
export interface ResponseEdit {
    response_name: string,
    response: ResponseDataEdit
}
