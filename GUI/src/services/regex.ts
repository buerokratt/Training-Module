import api from './api';
import ruuter_api from './ruuter-api';
import { saveAs } from 'file-saver';

export async function addRegex(regexData: { name: string }) {
  console.log(regexData);
  const { data } = await api.post<{ regex: string }>('regex/add', regexData);
  return data;
}

export async function editRegex(id: string | number, regexData: { name: string }) {
  const { data } = await api.post<{ readonly id: number; name: string }>(`regex/${id}`, regexData);
  return data;
}

export async function deleteRegex(id: string | number) {
  const { data } = await api.delete<void>(`regex/${id}`);
  return data;
}

export async function addRegexExample(regexExampleData: { example: string }) {
  const { data } = await api.post<{ example: string }>(`regex/examples`, regexExampleData);
  return data;
}

export async function editRegexExample(
    example_data: {
      regex_name: string,
      input: {
        regex: string,
        example: string,
        newExample: string
      }})
{
  const { data } = await api.post<{ regex_name: string }>(`regex/update-example`, example_data);
  return data;
}

export async function deleteRegexExample( delete_data: { regex_name: string, example: string }) {
  const { data } = await api.post<void>(`regex/delete-example`,delete_data);
  return data;
}

export async function downloadExamples(exampleData: { example: any }) {
  const { data } = await ruuter_api.post<{ example: any }>(`csv`, exampleData.example,  { responseType: 'blob' });
  saveAs(data as any, 'examples.csv')
  return data;
}
