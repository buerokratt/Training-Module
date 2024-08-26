import { rasaApi } from './api';
import { Config } from 'types/config';

export async function editConfig(configData: Config) {
  const { data } = await rasaApi.post(`config/update`, configData);
  return data;
}
