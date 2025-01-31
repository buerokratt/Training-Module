import { api, rasaApi } from './api';
import { saveAs } from 'file-saver';
import { PaginationParams } from 'types/api';
import { RegexTeaser } from 'types/regex';

export const getRegexes = async ({
  pageParam,
  pageSize,
  filter,
}: PaginationParams = { pageParam: 0, pageSize: 1000, filter: '' }): Promise<{ response: RegexTeaser[] }> => {
  const { data } = await rasaApi.get(`/regexes?size=${pageSize}&filter=${filter}&from=${pageParam}`);
  return data;
};

export async function addRegex(regexData: { name: string }) {
  const { data } = await rasaApi.post<{ regex: string }>('regex/add', regexData);
  return data;
}

export async function editRegex(regexData: { name: string; newName: string }) {
  const { data } = await rasaApi.post<{ name: string; newName: string }>(`regex/update`, regexData);
  return data;
}

export async function deleteRegex(deleteData: { regex_name: string | number }) {
  const { data } = await rasaApi.post<void>(`regex/delete`, deleteData);
  return data;
}

export async function addRegexExample(regexExampleData: { examples: string[] }) {
  const { data } = await rasaApi.post<{ regex_name: string; examples: string[] }>(
    `regex/add-example`,
    regexExampleData
  );
  return data;
}

export async function editRegexExample(example_data: {
  regex_name: string;
  input: {
    regex: string;
    example: string;
    newExample: string;
  };
}) {
  const { data } = await rasaApi.post<{ regex_name: string }>(`regex/update-example`, example_data);
  return data;
}

export async function deleteRegexExample(delete_data: { regex_name: string; example: string }) {
  const { data } = await rasaApi.post<void>(`regex/delete-example`, delete_data);
  return data;
}

export async function downloadExamples(exampleData: { example: any }) {
  const { data } = await api.post<{ example: any }>(`regex/csv`, exampleData.example, { responseType: 'blob' });
  saveAs(data as any, 'examples.csv');
  return data;
}
