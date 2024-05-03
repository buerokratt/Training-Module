export interface Story {
  id: string;
  story: string;
  steps: string | string[];
}

export interface Stories {
  response: Story[];
}

export interface StoryDTO extends Omit<Story, 'id'> {
}
