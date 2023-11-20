import api from './api';
import { Story, StoryDTO } from 'types/story';

export async function addStory(storyData: StoryDTO) {
  const { data } = await api.post<Story>('stories/add', storyData);
  return data;
}

export async function editStory(id: string | number, storyData: StoryDTO) {
  const { data } = await api.post<Story>('stories/update', {id, data: storyData});
  return data;
}

export async function deleteStory(id: string | number) {
  const { data } = await api.post<void>('stories/delete', { story: id});
  return data;
}
