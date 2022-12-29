export const configurationData = {
  recipe: 'default.v1',
  language: 'et',
  pipeline: {
    epochs: 20,
    randomSeed: 50,
    threshold: 0.8,
  },
  policies: [
    {
      id: 1,
      name: 'MemorizationPolicy',
      active: false,
      priority: 3,
    },
    {
      id: 2,
      name: 'TEDPolicy',
      active: true,
      priority: 1,
      maxHistory: 5,
      epochs: 1000,
    },
    {
      id: 3,
      name: 'RulePolicy',
      active: true,
      checkForContradictions: false,
      priority: 6,
      coreFallbackThreshold: 0.6,
    },
  ],
};
