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
      name: 'MemorizationPolicy',
      active: false,
    },
    {
      name: 'TEDPolicy',
      active: true,
    },
    {
      name: 'RulePolicy',
      active: true,
    },
  ],
};
