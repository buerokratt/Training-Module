import api from './api';
import { Config } from 'types/config';

export async function editConfig(configData: Config) {
  const { data } = await api.post(`config/update`, configData);
  return data;
}
