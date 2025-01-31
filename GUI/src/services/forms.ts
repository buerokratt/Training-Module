import { rasaApi } from './api';
import { Form, FormCreateDTO, FormEditDTO } from 'types/form';

export async function createForm(formData: FormCreateDTO) {
  const { data } = await rasaApi.post<Form>(`forms/add`, formData);
  return data;
}

export async function editForm(form_name: string , form: FormEditDTO) {
  const { data } = await rasaApi.post<Form>(`forms/update`, {form_name,form});
  return data;
}

export async function deleteForm(id: string | number) {
  const { data } = await rasaApi.post<void>(`forms/delete`, {form_name: id});
  return data;
}
