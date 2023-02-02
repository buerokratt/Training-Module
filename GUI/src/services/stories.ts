import api from './api';
import { Story, StoryDTO } from 'types/story';

export async function addStory(storyData: StoryDTO) {
  const { data } = await api.post<Story>('stories', storyData);
  return data;
}

export async function editStory(id: string | number, storyData: StoryDTO) {
  const { data } = await api.patch<Story>(`stories/${id}`, storyData);
  return data;
}

export async function deleteStory(id: string | number) {
  const { data } = await api.delete<void>(`stories/${id}`);
  return data;
}
