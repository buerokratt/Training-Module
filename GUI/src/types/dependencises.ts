export interface Dependencies {
    response: Dependency[];
}

export interface Dependency {
    name: string;
    rules: string[];
    stories: string [];
}

