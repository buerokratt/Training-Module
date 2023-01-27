export const resultsData = [
  {
    name: 'Testlood',
    files: [
      {
        fileName: 'failed_test_stories.yml',
        lastModified: new Date(),
        fileUri: import.meta.env.BASE_URL + 'mock-results/testlood/failed_test_stories.yml',
      },
      {
        fileName: 'stories_with_warnings.yml',
        lastModified: new Date(),
        fileUri: import.meta.env.BASE_URL + 'mock-results/testlood/stories_with_warnings.yml',
      },
    ],
  },
  {
    name: 'K-folds test',
    files: [
      {
        fileName: 'failed_test_stories.yml',
        lastModified: new Date(),
        fileUri: import.meta.env.BASE_URL + 'mock-results/cross_validation/failed_test_stories.yml',
      },
      {
        fileName: 'intent_confusion_matrix.png',
        lastModified: new Date(),
        fileUri: import.meta.env.BASE_URL + 'mock-results/cross_validation/intent_confusion_matrix.png',
      },
      {
        fileName: 'intent_errors.json',
        lastModified: new Date(),
        fileUri: import.meta.env.BASE_URL + 'mock-results/cross_validation/intent_errors.json',
      },
    ],
  },
  {
    name: '80-20 (80% treeni / 20% valideeri)',
    files: [
      {
        fileName: 'intent_confusion_matrix.png',
        lastModified: new Date(),
        fileUri: import.meta.env.BASE_URL + 'mock-results/80-20/intent_confusion_matrix.png',
      },
      {
        fileName: 'intent_histogram.png',
        lastModified: new Date(),
        fileUri: import.meta.env.BASE_URL + 'mock-results/80-20/intent_histogram.png',
      },
      {
        fileName: 'intent_report.json',
        lastModified: new Date(),
        fileUri: import.meta.env.BASE_URL + 'mock-results/80-20/intent_report.json',
      },
    ],
  },
];
