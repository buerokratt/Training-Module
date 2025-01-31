import { PaginationParams } from 'types/api';
import { rasaApi } from './api';
import { ResponseEdit, ResponseDataEdit, Response } from 'types/response';

export const getResponses = async ({
  pageParam,
  pageSize,
  filter,
}: PaginationParams): Promise<{ response: Response[] }> => {
  const { data } = await rasaApi.get(`/responses-list?size=${pageSize}&filter=${filter}&from=${pageParam}`);
  return data;
};

export async function editResponse(id: string, responseText: string, update = true) {
  if (responseText.startsWith('"') && responseText.endsWith('"')) {
    responseText = responseText.slice(1, -1);
  }
  const responseEditData = <ResponseEdit>{};
  const responseDataEdit = <ResponseDataEdit>{};

  responseEditData.response_name = id;
  responseDataEdit[id] = [{ text: responseText }];
  responseEditData.response = responseDataEdit;

  if (update) {
    const { data } = await rasaApi.post<{ response: string }>(`responses/update`, responseEditData);
    return data;
  } else {
    const { data } = await rasaApi.post<{ response: string }>(`responses/add`, responseEditData);
    return data;
  }
}

export async function deleteResponse(response: { response: string }) {
  const { data } = await rasaApi.post(`responses/delete`, response);
  return data;
}
