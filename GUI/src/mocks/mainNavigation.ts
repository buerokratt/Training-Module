export const mainNavigationET = [
  {
    id: 'conversations',
    label: 'Vestlus',
    path: '/vestlus',
    children: [],
  },
  {
    id: 'training',
    label: 'Treening',
    path: '/treening',
    children: [
      {
        label: 'Treening',
        path: '/treening/treening',
        children: [
          {
            label: 'Teemad',
            path: '/treening/treening/teemad',
          },
          {
            label: 'REGEX',
            path: '/treening/treening/regex',
          },
          {
            label: 'Sünonüümid',
            path: '/treening/treening/sunonuumid',
          },
          {
            label: 'Otsingutabelid',
            path: '/treening/treening/otsingutabelid',
          },
        ],
      },
      {
        label: 'Vastused',
        path: '/treening/vastused',
      },
      {
        label: 'Vormid',
        path: '/treening/vormid',
      },
      {
        label: 'Kasutuslood',
        path: '/treening/kasutuslood',
      },
      {
        label: 'Konfiguratsioon',
        path: '/treening/konfiguratsioon',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analüütika',
    path: '/analuutika',
    children: [],
  },
  {
    id: 'settings',
    label: 'Haldus',
    path: '/haldus',
    children: [],
  },
  {
    id: 'monitoring',
    label: 'Seire',
    path: '/seire',
    children: [],
  },
];

export const mainNavigationEN = [
  {
    label: 'Training',
    path: '/training',
    children: [
      {
        label: 'Training',
        path: '/training/intents',
        children: [
          {
            label: 'Common intents',
            path: '/training/intents/common-intents',
          },
          {
            label: 'Local intents',
            path: '/training/intents/local-intents',
          },
          {
            label: 'REGEX',
            path: '/training/intents/regex',
          },
          {
            label: 'Synonyms',
            path: '/training/intents/synonyms',
          },
          {
            label: 'Lookup tables',
            path: '/training/intents/lookup-tables',
          },
        ],
      },
      {
        label: 'Answers',
        path: '/training/answers',
      },
      {
        label: 'Forms',
        path: '/training/forms',
      },
      {
        label: 'Stories',
        path: '/training/stories',
      },
      {
        label: 'Configuration',
        path: '/training/configuration',
      },
    ],
  },
  {
    label: 'Historical conversations',
    path: '/historical-conversations',
    children: [
      {
        label: 'Mark intents',
        path: '/historical-conversations/mark-intents',
      },
      {
        label: 'Mark conversations',
        path: '/historical-conversations/mark-conversations',
      },
    ],
  },
  {
    label: 'Model bank and analytics',
    path: '/model-bank-and-analytics',
    children: [
      {
        label: 'Training',
        path: '/model-bank-and-analytics/training',
      },
      {
        label: 'Models',
        path: '/model-bank-and-analytics/models',
        children: [
          {
            label: 'Intents overview',
            path: '/model-bank-and-analytics/models/intents-overview',
          },
          {
            label: 'Model comparison',
            path: '/model-bank-and-analytics/models/model-comparison',
          },
        ],
      },
      {
        label: 'Testcases',
        path: '/model-bank-and-analytics/testcases',
      },
    ],
  },
  {
    label: 'Simulation',
    path: '/simulation',
    children: [],
  },
];
