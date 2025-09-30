import { PaginationParams } from 'types/api';
import { rasaApi } from './api';
import { ResponseEdit, Response } from 'types/response';

export const getResponses = async ({
  pageParam,
  pageSize,
  filter,
}: PaginationParams): Promise<{ response: Response[] }> => {
  const { data } = await rasaApi.get(`/responses?size=${pageSize}&filter=${filter}&from=${pageParam}`);
  return data;
};

export async function editResponse(id: string, responseText: string, update = true, intent?: string) {
  if (responseText.startsWith('"') && responseText.endsWith('"')) {
    responseText = responseText.slice(1, -1);
  }

  const responseEditData: ResponseEdit = {
    response_name: id,
    response: {
      [id]: [{ text: responseText }],
    },
    intent,
  };

  const endpoint = update ? 'responses/update' : 'responses/add';
  const { data } = await rasaApi.post<{ response: string }>(endpoint, responseEditData);
  return data;
}

export async function deleteResponse(response: { response: string }) {
  const { data } = await rasaApi.post(`responses/delete`, response);
  return data;
}
