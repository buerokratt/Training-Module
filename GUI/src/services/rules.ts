import { rasaApi } from './api';
import { RuleDTO } from '../types/rule';

export async function addRule(ruleData: RuleDTO) {
  const { data } = await rasaApi.post('rule/add', ruleData);
  return data;
}

export async function editRule(id: string | number, ruleData: RuleDTO) {
  const { data } = await rasaApi.post('rule/update', { id, data: ruleData });
  return data;
}

export async function deleteRule(id: string | number) {
  const payload: any = {
    rule: id,
  };
  const { data } = await rasaApi.post<void>('rule/delete', payload);
  return data;
}
