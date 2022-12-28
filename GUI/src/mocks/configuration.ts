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
      randomSeed: 10,
      epochs: 10,
      constrainSimilarities: false,
    },
    {
      id: 2,
      name: 'TEDPolicy',
      active: true,
      randomSeed: 42,
      epochs: 11,
      constrainSimilarities: true,
    },
    {
      id: 3,
      name: 'RulePolicy',
      active: true,
      randomSeed: 20,
      epochs: 20,
      constrainSimilarities: true,
    },
  ],
};
