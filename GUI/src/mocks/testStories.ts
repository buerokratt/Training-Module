export const testStoriesData = [
  {
    id: 1,
    story: 'common_klienditeenindajale_suunamine',
    steps: {
      user: 'tahan suhelda klienditeenindajaga',
      intent: 'common_klienditeenindajale_suunamine',
      action: 'utter_common_klienditeenindajale_suunamine',
    },
    hasTest: false,
    activeStory: true
  },
  {
    id: 2,
    story: 'common_hüvasti_jätmine',
    steps: {
      user: 'head aega',
      intent: 'common_hüvasti_jätmine',
      action: 'utter_common_hüvasti_jätmine',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 3,
    story: 'common_kinnitamine',
    steps: {
      user: 'jah',
      intent: 'common_kinnitamine',
      action: 'action_listen',
    },
    hasTest: false,
    activeStory: true
  },
  {
    id: 4,
    story: 'common_eitamine',
    steps: {
      user: 'ei',
      intent: 'common_eitamine',
      action: 'action_listen',
    },
    hasTest: true,
    activeStory: true
  },
  {
    id: 5,
    story: 'common_tänamine',
    steps: {
      user: 'aitäh',
      intent: 'common_tänamine',
      action: 'utter_common_tänamine',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 6,
    story: 'common_kompliment_botile',
    steps: {
      user: 'oled tore',
      intent: 'common_kompliment_botile',
      action: 'utter_common_kompliment_botile',
    },
    hasTest: true,
    activeStory: false
  },
  {
    id: 7,
    story: 'common_kuidas_läheb',
    steps: {
      user: 'kuidas läheb',
      intent: 'common_kuidas_läheb',
      action: 'utter_common_kuidas_läheb',
    },
    hasTest: true,
    activeStory: false
  },
  {
    id: 8,
    story: 'common_abi_küsimine',
    steps: {
      user: 'mul on abi vaja',
      intent: 'common_abi_küsimine',
      action: 'utter_common_abi_küsimine',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 9,
    story: 'common_kas_oled_robot',
    steps: {
      user: 'kas sa oled robot',
      intent: 'common_kas_oled_robot',
      action: 'utter_common_kas_oled_robot',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 10,
    story: 'common_mida_teha_oskad',
    steps: {
      user: 'mida sa oskad?',
      intent: 'common_mida_teha_oskad',
      action: 'utter_common_mida_teha_oskad',
    },
    hasTest: true,
    activeStory: false
  },
  {
    id: 11,
    story: 'common_kelle_loodud',
    steps: {
      user: 'Kes su tegi',
      intent: 'common_kelle_loodud',
      action: 'utter_common_kelle_loodud',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 12,
    story: 'common_tervitus',
    steps: {
      user: 'tere',
      intent: 'common_tervitus',
      action: 'utter_common_tervitus',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 13,
    story: 'common_kui_vana_oled',
    steps: {
      user: 'kui vana sa oled',
      intent: 'common_kui_vana_oled',
      action: 'utter_common_kui_vana_oled',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 14,
    story: 'common_roppused',
    steps: {
      user: 'vittu',
      intent: 'common_roppused',
      action: 'utter_common_roppused',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 15,
    story: 'common_hädaabi_number',
    steps: {
      user: 'hädaabi number',
      intent: 'common_hädaabi_number',
      action: 'utter_common_hädaabi_number',
    },
    hasTest: true,
    activeStory: false
  },
  {
    id: 16,
    story: 'common_vaimne_tervis',
    steps: {
      user: 'paanika',
      intent: 'common_vaimne_tervis',
      action: 'utter_common_vaimne_tervis',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 17,
    story: 'common_mis_keeles',
    steps: {
      user: 'Можно по рус?',
      intent: 'common_mis_keeles',
      action: 'utter_common_mis_keeles',
    },
    hasTest: false,
    activeStory: false
  },
  {
    id: 18,
    story: 'common_covid_küsimused',
    steps: {
      user: 'koroona',
      intent: 'common_covid_küsimused',
      action: 'utter_common_covid_küsimused',
    },
    hasTest: true,
    activeStory: false
  },
];
