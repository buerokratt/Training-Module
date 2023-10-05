import api from './temp-api';
import {ResponseEdit, ResponseDataEdit} from "types/response"

export async function editResponse(id: string,  responseText: string, update = true) {
  const responseEditData = <ResponseEdit>{};
  const responseDataEdit = <ResponseDataEdit>{};

  responseEditData.response_name = id;
  responseDataEdit[id] = [{text: responseText}];
  responseEditData.response = responseDataEdit;

  if (update) {
    const {data} = await api.post<{ response: string }>(`responses/update`, responseEditData);
    return data;
  } else {
    const {data} = await api.post<{ response: string }>(`responses/add`, responseEditData);
    return data;
  }
}


export async function deleteResponse(id: string | number) {
  const { data } = await api.delete<void>(`responses/${id}`);
  return data;
}
