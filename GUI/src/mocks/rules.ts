export const rulesData = [
  {
    id: 1,
    rule: 'nlu_fallback (1.0)(confidence kontrollimine)',
  },
  {
    id: 2,
    rule: 'nlu_fallback (2.1)(Kui confidence 60-80%, siis formsi aktiveerimine, mis küsib kasutajalt "Jah/Ei")',
  },
  {
    id: 3,
    rule: 'nlu_fallback (3.1) (paneb formsi kinni ja kasutaja soovil aktiveerib intenti confidenciga 60-80%)',
  },
  {
    id: 4,
    rule: 'nlu_fallback (2.2)(Kui confidence alla 60%)',
  },
  {
    id: 5,
    rule: 'nlu_fallback (3.2)(kui conficende oli alla 60%, siis küsib, kas soovib klienditeenindajat)',
  },
  {
    id: 6,
    rule: 'nlu_fallback (3.3)(kui conficende oli alla 60%, siis küsib, kas soovib klienditeenindajat + kinnitamine path)',
  },
  {
    id: 7,
    rule: 'nlu_fallback (3.3)(kui conficende oli alla 60%, siis küsib, kas soovib klienditeenindajat + eitamine path)',
  },
  {
    id: 8,
    rule: 'common_hüvasti_jätmine',
  },
  {
    id: 9,
    rule: 'common_tänamine',
  },
  {
    id: 10,
    rule: 'common_kompliment_botile',
  },
  {
    id: 11,
    rule: 'common_kuidas_läheb',
  },
  {
    id: 12,
    rule: 'common_abi_küsimine',
  },
  {
    id: 13,
    rule: 'common_kas_oled_robot',
  },
  {
    id: 14,
    rule: 'common_mida_teha_oskad',
  },
  {
    id: 15,
    rule: 'common_kelle_loodud',
  },
  {
    id: 16,
    rule: 'common_tervitus',
  },
  {
    id: 17,
    rule: 'common_kui_vana_oled',
  },
  {
    id: 18,
    rule: 'common_roppused',
  },
];
