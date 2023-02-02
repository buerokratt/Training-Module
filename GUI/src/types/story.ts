export interface Story {
  readonly id: number;
  story: string;
}

export interface StoryDTO extends Omit<Story, 'id'> {
}
