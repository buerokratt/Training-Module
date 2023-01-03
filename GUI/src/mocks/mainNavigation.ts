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
            label: 'Vastused',
            path: '/treening/treening/vastused',
          },
          {
            label: 'Kasutuslood',
            path: '/treening/treening/kasutuslood',
          },
          {
            label: 'Konfiguratsioon',
            path: '/treening/treening/konfiguratsioon',
          },
          {
            label: 'Vormid',
            path: '/treening/treening/vormid',
          },
          {
            label: 'Pilud',
            path: '/treening/treening/pilud',
          },
        ],
      },
      {
        label: 'Ajaloolised vestlused',
        path: '/treening/ajaloolised-vestlused',
        children: [
          {
            label: 'Ajalugu',
            path: '/treening/ajaloolised-vestlused/ajalugu',
          },
          {
            label: 'Pöördumised',
            path: '/treening/ajaloolised-vestlused/poordumised',
          },
        ],
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Mudelipank ja analüütika',
    path: '/mudelipank-ja-analuutika',
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
    id: 'conversations',
    label: 'Conversations',
    path: '/conversations',
    children: [],
  },
  {
    id: 'training',
    label: 'Training',
    path: '/training',
    children: [
      {
        label: 'Training',
        path: '/training/training',
        children: [
          {
            label: 'Intents',
            path: '/training/training/intents',
          },
          {
            label: 'Responses',
            path: '/training/training/responses',
          },
          {
            label: 'Stories',
            path: '/training/training/stories',
          },
          {
            label: 'Configuration',
            path: '/training/training/configuration',
          },
          {
            label: 'Forms',
            path: '/training/training/forms',
          },
          {
            label: 'Slots',
            path: '/training/training/slots',
          },
        ],
      },
      {
        label: 'Historical conversations',
        path: '/training/historical-conversations',
        children: [
          {
            label: 'History',
            path: '/training/historical-conversations/history',
          },
          {
            label: 'Appeals',
            path: '/training/historical-conversations/appeals',
          },
        ],
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Model bank and analytics',
    path: '/model-bank-and-analytics',
    children: [],
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    children: [],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    path: '/monitoring',
    children: [],
  },
];
