import api from './api';
import { StoryDTO } from 'types/story';
import {RuleDTO} from "../types/rule";

export async function addStoryOrRule(storyData: StoryDTO | RuleDTO, category: string) {
  const { data } = await api.post(category + '/add', storyData);
  return data;
}

export async function editStoryOrRule(id: string | number, storyData: StoryDTO | RuleDTO, category: string) {
  const { data } = await api.post(category + '/update', { id, data: storyData });
  return data;
}

export async function deleteStoryOrRule(id: string | number, category: string) {
  const payload: any = {
    rule: category === 'rules' ? id : undefined,
    story: category === 'stories' ? id : undefined
  };
  const { data } = await api.post<void>(category + '/delete', payload);
  return data;
}
