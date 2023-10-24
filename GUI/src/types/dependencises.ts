export interface Dependencies {
    response: Dependency[];
}

export interface Dependency {
    name: String;
    rules: string[];
    stories: string [];
}

