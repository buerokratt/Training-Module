import { rasaApi } from './api';
import { Rule, RuleDTO } from '../types/rule';
import { PaginationParams } from 'types/api';

export const getRules = async ({ pageParam, pageSize, filter }: PaginationParams): Promise<{ response: Rule[] }> => {
  const { data } = await rasaApi.get(`/rules?size=${pageSize}&filter=${filter}&from=${pageParam}`);
  return data;
};

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
