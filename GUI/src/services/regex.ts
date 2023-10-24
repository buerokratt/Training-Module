import api from './temp-api';
import ruuter_api from './ruuter-api';
import { saveAs } from 'file-saver';

export async function addRegex(regexData: { name: string }) {
  const { data } = await api.post<{ readonly id: number; name: string }>('regex');
  return data;
}

export async function editRegex(id: string | number, regexData: { name: string }) {
  const { data } = await api.patch<{ readonly id: number; name: string }>(`regex/${id}`, regexData);
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
      new_name: string,
      old_name: string
    },
    regexExampleData : {
      regex_name: string,
      input: {
        regex: string,
        examples: string[]
      }})
{
  const index = regexExampleData.input.examples.indexOf(example_data.old_name);
  if(index !== -1 && example_data.new_name.trim().length > 0) {
    regexExampleData.input.examples[index] = example_data.new_name;
  }
  const { data } = await api.post<{ regex_name: string }>(`regex/update`, regexExampleData);
  return data;
}

export async function deleteRegexExample({ update_data }: {update_data: { regex_name: string | undefined, example: string | undefined }}) {
  const { data } = await api.post<void>(`regex/delete`,update_data);
  return data;
}

export async function downloadExamples(exampleData: { example: any }) {
  const { data } = await ruuter_api.post<{ example: any }>(`csv`, exampleData.example,  { responseType: 'blob' });
  saveAs(data as any, 'examples.csv')
  return data;
}
