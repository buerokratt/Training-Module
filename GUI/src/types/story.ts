import {ResponseData} from "./response";

export interface Story {
  id: string;
  steps: string | string[]
}
export interface Stories {
  response: Story[];
}
export interface StoryDTO extends Omit<Story, 'id'> {
}
