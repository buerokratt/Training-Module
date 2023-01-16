import api from './api';
import { Form, FormCreateDTO, FormEditDTO } from 'types/form';

export async function createForm(formData: FormCreateDTO) {
  const { data } = await api.post<Form>(`forms`, formData);
  return data;
}

export async function editForm(id: string | number, formData: FormEditDTO) {
  const { data } = await api.patch<Form>(`forms/${id}`, formData);
  return data;
}

export async function deleteForm(id: string | number) {
  const { data } = await api.delete<void>(`forms/${id}`);
  return data;
}
