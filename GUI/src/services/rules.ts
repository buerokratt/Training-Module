import { rasaApi } from './api';
import { RuleDTO } from '../types/rule';

export async function addRule(ruleData: RuleDTO) {
  const { data } = await rasaApi.post('rules/add', ruleData);
  return data;
}

export async function editRule(id: string | number, ruleData: RuleDTO) {
  const { data } = await rasaApi.post('rules/update', { id, data: ruleData });
  return data;
}

export async function deleteRule(id: string | number) {
  const payload: any = {
    rule: id,
  };
  const { data } = await rasaApi.post<void>('rules/delete', payload);
  return data;
}
