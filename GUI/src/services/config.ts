import api from './api';
import { Config } from 'types/config';

export async function editConfig(configData: Config) {
  const { data } = await api.patch(`active-configuration`, configData);
  return data;
}
