export const mainNavigationET = [
  {
    label: 'Treening',
    path: '/treening',
    children: [
      {
        label: 'Treening',
        path: '/treening/teemad',
        children: [
          {
            label: 'Common teemad',
            path: '/treening/teemad/common-teemad',
          },
          {
            label: 'Lokaalsed teemad',
            path: '/treening/teemad/lokaalsed-teemad',
          },
          {
            label: 'REGEX',
            path: '/treening/teemad/regex',
          },
          {
            label: 'Sünonüümid',
            path: '/treening/teemad/sunonuumid',
          },
          {
            label: 'Otsingutabelid',
            path: '/treening/teemad/otsingutabelid',
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
    label: 'Ajaloolised vestlused',
    path: '/ajaloolised-vestlused',
    children: [
      {
        label: 'Märgenda teemasid',
        path: '/ajaloolised-vestlused/margenda-teemasid',
      },
      {
        label: 'Märgenda vestluseid',
        path: '/ajaloolised-vestlused/margenda-vestluseid',
      },
    ],
  },
  {
    label: 'Mudelipank ja analüütika',
    path: '/mudelipank-analuutika',
    children: [
      {
        label: 'Treening',
        path: '/mudelipank-analuutika/treening',
      },
      {
        label: 'Mudelid',
        path: '/mudelipank-analuutika/mudelid',
        children: [
          {
            label: 'Teemade ülevaade',
            path: '/mudelipank-analuutika/mudelid/teemade-ulevaade',
          },
          {
            label: 'Mudelite võrdlus',
            path: '/mudelipank-analuutika/mudelid/mudelite-vordlus',
          },
        ],
      },
      {
        label: 'Testlood',
        path: '/mudelipank-analuutika/testlood',
      },
    ],
  },
  {
    label: 'Simulatsioon',
    path: '/simulatsioon',
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
