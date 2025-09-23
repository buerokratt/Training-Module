import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineSettingsInputAntenna } from 'react-icons/md';

import { Card, DataTable, FormInput, FormSelect, Icon, Track } from 'components';
import { Metrics, IntentsReport, SummaryMetrics } from 'types/intentsReport';
import { Model } from 'types/model';
import { getColumns } from './columns';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import { isHiddenFeaturesEnabled } from 'constants/config';

const intentsReport = {
  intent_evaluation: {
    report: {
      common_service_estimated_subsistence_minimum: {
        precision: 0.8392857142857143,
        recall: 0.9591836734693877,
        'f1-score': 0.8952380952380952,
        support: 49,
        confused_with: {
          common_service_nba_results: 1,
          common_service_CPI: 1,
        },
      },
      common_tänamine: {
        precision: 0.4117647058823529,
        recall: 0.7,
        'f1-score': 0.5185185185185185,
        support: 10,
        confused_with: {
          common_eitamine: 3,
        },
      },
      serviceDemo: {
        precision: 1,
        recall: 0.6666666666666666,
        'f1-score': 0.8,
        support: 18,
        confused_with: {
          common_service_unemployment_rate: 5,
          common_service_companies_employees: 1,
        },
      },
      common_service_school_holiday: {
        precision: 0.9644444444444444,
        recall: 0.9954128440366973,
        'f1-score': 0.979683972911964,
        support: 218,
        confused_with: {
          common_teenus_ilm: 1,
        },
      },
      common_eitamine: {
        precision: 0.4864864864864865,
        recall: 0.8181818181818182,
        'f1-score': 0.6101694915254238,
        support: 22,
        confused_with: {
          common_tänamine: 1,
          common_tervitus: 1,
        },
      },
      common_service_companies_contactdetails: {
        precision: 1,
        recall: 0.06666666666666667,
        'f1-score': 0.125,
        support: 15,
        confused_with: {
          common_service_companies_revenue: 13,
          common_service_companies_employees: 1,
        },
      },
      common_service_companies_revenue: {
        precision: 0.2777777777777778,
        recall: 0.8333333333333334,
        'f1-score': 0.4166666666666667,
        support: 12,
        confused_with: {
          common_service_companies_employees: 1,
          common_service_motor_vehicle_tax: 1,
        },
      },
      common_service_companies_related_persons: {
        precision: 1,
        recall: 0.36363636363636365,
        'f1-score': 0.5333333333333333,
        support: 11,
        confused_with: {
          common_service_companies_employees: 6,
          common_service_companies_revenue: 1,
        },
      },
      common_service_holidays: {
        precision: 0.96875,
        recall: 0.9117647058823529,
        'f1-score': 0.9393939393939394,
        support: 34,
        confused_with: {
          common_service_school_holiday: 3,
        },
      },
      common_teenus_citizien_initiative: {
        precision: 0.75,
        recall: 0.9,
        'f1-score': 0.8181818181818182,
        support: 10,
        confused_with: {
          common_service_nba_results: 1,
        },
      },
      common_hüvasti_jätmine: {
        precision: 1,
        recall: 0.6666666666666666,
        'f1-score': 0.8,
        support: 18,
        confused_with: {
          common_tänamine: 2,
          common_tervitus: 2,
        },
      },
      common_service_companies_beneficiaries: {
        precision: 1,
        recall: 0.35714285714285715,
        'f1-score': 0.5263157894736842,
        support: 14,
        confused_with: {
          common_teenus_ilm: 6,
          common_service_companies_employees: 2,
        },
      },
      common_kinnitamine: {
        precision: 1,
        recall: 0.14285714285714285,
        'f1-score': 0.25,
        support: 28,
        confused_with: {
          common_eitamine: 13,
          common_tervitus: 4,
        },
      },
      common_teenus_rk_isiku_kohalolu: {
        precision: 1,
        recall: 0.2,
        'f1-score': 0.33333333333333337,
        support: 15,
        confused_with: {
          common_service_estimated_subsistence_minimum: 4,
          common_service_school_holiday: 3,
        },
      },
      common_service_unemployment_rate: {
        precision: 0.6923076923076923,
        recall: 0.8181818181818182,
        'f1-score': 0.7500000000000001,
        support: 22,
        confused_with: {
          common_service_companies_employees: 2,
          common_tervitus: 1,
        },
      },
      common_service_companies_employees: {
        precision: 0.4,
        recall: 0.8571428571428571,
        'f1-score': 0.5454545454545455,
        support: 14,
        confused_with: {
          common_service_companies_revenue: 2,
        },
      },
      common_teenus_citizien_initiative_popular: {
        precision: 0.5217391304347826,
        recall: 0.9230769230769231,
        'f1-score': 0.6666666666666667,
        support: 13,
        confused_with: {
          common_teenus_citizien_initiative: 1,
        },
      },
      common_service_exchange_rate: {
        precision: 1,
        recall: 0.625,
        'f1-score': 0.7692307692307693,
        support: 8,
        confused_with: {
          common_tänamine: 2,
          common_eitamine: 1,
        },
      },
      common_tervitus: {
        precision: 0.5588235294117647,
        recall: 0.95,
        'f1-score': 0.7037037037037037,
        support: 20,
        confused_with: {
          common_service_unemployment_rate: 1,
        },
      },
      common_ask_csa: {
        precision: 1,
        recall: 0.5,
        'f1-score': 0.6666666666666666,
        support: 12,
        confused_with: {
          common_teenus_citizien_initiative_popular: 4,
          common_service_companies_revenue: 2,
        },
      },
      common_teenus_rk_hääletus: {
        precision: 0.9,
        recall: 0.5294117647058824,
        'f1-score': 0.6666666666666667,
        support: 17,
        confused_with: {
          common_tervitus: 4,
          common_service_estimated_subsistence_minimum: 2,
        },
      },
      common_teenus_nordpool: {
        precision: 1,
        recall: 0.5294117647058824,
        'f1-score': 0.6923076923076924,
        support: 17,
        confused_with: {
          common_teenus_nordpool2: 3,
          common_service_companies_workforce_taxes: 2,
        },
      },
      common_service_motor_vehicle_tax: {
        precision: 0.8970588235294118,
        recall: 1,
        'f1-score': 0.9457364341085273,
        support: 61,
        confused_with: {},
      },
      serviceCatDemo: {
        precision: 1,
        recall: 0.9444444444444444,
        'f1-score': 0.9714285714285714,
        support: 18,
        confused_with: {
          common_service_motor_vehicle_tax: 1,
        },
      },
      common_service_companies_national_taxes: {
        precision: 1,
        recall: 0.8571428571428571,
        'f1-score': 0.923076923076923,
        support: 14,
        confused_with: {
          common_service_companies_workforce_taxes: 2,
        },
      },
      common_service_companies_workforce_taxes: {
        precision: 0.5833333333333334,
        recall: 0.9333333333333333,
        'f1-score': 0.7179487179487181,
        support: 15,
        confused_with: {
          common_service_companies_employees: 1,
        },
      },
      serviceRandom: {
        precision: 1,
        recall: 0.4444444444444444,
        'f1-score': 0.6153846153846153,
        support: 18,
        confused_with: {
          common_teenus_citizien_initiative_popular: 3,
          common_teenus_ilm: 2,
        },
      },
      common_service_CPI: {
        precision: 0.9393939393939394,
        recall: 0.7948717948717948,
        'f1-score': 0.8611111111111112,
        support: 39,
        confused_with: {
          common_service_motor_vehicle_tax: 3,
          common_service_estimated_subsistence_minimum: 1,
        },
      },
      common_teenus_nordpool2: {
        precision: 0.9047619047619048,
        recall: 0.9047619047619048,
        'f1-score': 0.9047619047619048,
        support: 42,
        confused_with: {
          common_service_companies_workforce_taxes: 2,
          common_service_motor_vehicle_tax: 1,
        },
      },
      common_service_companies_lihtandmed: {
        precision: 0,
        recall: 0,
        'f1-score': 0,
        support: 13,
        confused_with: {
          common_service_companies_revenue: 5,
          common_service_companies_employees: 4,
          common_service_companies_workforce_taxes: 4,
        },
      },
      common_service_nba_results: {
        precision: 0.8333333333333334,
        recall: 1,
        'f1-score': 0.9090909090909091,
        support: 30,
        confused_with: {},
      },
      common_teenus_ilm: {
        precision: 0.8412698412698413,
        recall: 0.9814814814814815,
        'f1-score': 0.905982905982906,
        support: 54,
        confused_with: {
          common_teenus_citizien_initiative: 1,
        },
      },
      common_klienditeenindajale_suunamine: {
        precision: 0.8928571428571429,
        recall: 0.8620689655172413,
        'f1-score': 0.8771929824561403,
        support: 29,
        confused_with: {
          common_eitamine: 2,
          common_service_unemployment_rate: 1,
        },
      },
      accuracy: 0.8161290322580645,
      'macro avg': {
        precision: 0.8079814484699976,
        recall: 0.6980693058288127,
        'f1-score': 0.6860074771098126,
        support: 930,
      },
      'weighted avg': {
        precision: 0.8650358074639694,
        recall: 0.8161290322580645,
        'f1-score': 0.8004022610647045,
        support: 930,
      },
      'micro avg': {
        precision: 0.8161290322580645,
        recall: 0.8161290322580645,
        'f1-score': 0.8161290322580645,
        support: 930,
      },
    },
    precision: 0.8650358074639694,
    f1_score: null,
    errors: [
      {
        text: 'csas',
        intent: 'common_ask_csa',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.12406106293201447,
        },
      },
      {
        text: 'csa csas',
        intent: 'common_ask_csa',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.20070338249206543,
        },
      },
      {
        text: 'iialgi',
        intent: 'common_eitamine',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.07070718705654144,
        },
      },
      {
        text: 'vist ei',
        intent: 'common_eitamine',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.24454420804977417,
        },
      },
      {
        text: 'Ei, aitäh)',
        intent: 'common_eitamine',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.17754821479320526,
        },
      },
      {
        text: 'ilusat õhtu jätku',
        intent: 'common_hüvasti_jätmine',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.1457398235797882,
        },
      },
      {
        text: 'kena päeva',
        intent: 'common_hüvasti_jätmine',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.07766807079315186,
        },
      },
      {
        text: 'jah',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.11535774171352386,
        },
      },
      {
        text: 'ye',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.0934179276227951,
        },
      },
      {
        text: 'Muidugi',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.10848208516836166,
        },
      },
      {
        text: 'oki',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.07404723018407822,
        },
      },
      {
        text: 'heaküll',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.09326810389757156,
        },
      },
      {
        text: 'sobib',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.07602646946907043,
        },
      },
      {
        text: 'ja',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.15009601414203644,
        },
      },
      {
        text: 'jep',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.1069163903594017,
        },
      },
      {
        text: 'oukei',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.10843382030725479,
        },
      },
      {
        text: 'nõus',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_klienditeenindajale_suunamine',
          confidence: 0.1367705762386322,
        },
      },
      {
        text: 'Yes',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.08703842759132385,
        },
      },
      {
        text: 'suuna inimesele',
        intent: 'common_klienditeenindajale_suunamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.13724714517593384,
        },
      },
      {
        text: 'suuna mind ümber',
        intent: 'common_klienditeenindajale_suunamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.10575789213180542,
        },
      },
      {
        text: 'mis on tabija indeks',
        intent: 'common_service_CPI',
        intent_prediction: {
          name: 'common_service_motor_vehicle_tax',
          confidence: 0.09835731238126755,
        },
      },
      {
        text: 'kes on firma tegelikud kasusaajad',
        intent: 'common_service_companies_beneficiaries',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.1973634660243988,
        },
      },
      {
        text: 'palun infot ettevõtte tegelike kasusaajate kohta',
        intent: 'common_service_companies_beneficiaries',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.11450161039829254,
        },
      },
      {
        text: 'kes on ettevõtte kasusaajad',
        intent: 'common_service_companies_beneficiaries',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.13723842799663544,
        },
      },
      {
        text: 'kes saavad firma tegevusest kasu',
        intent: 'common_service_companies_beneficiaries',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.07774506509304047,
        },
      },
      {
        text: 'firma tegevusest kasu saavad isikud',
        intent: 'common_service_companies_beneficiaries',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.08301087468862534,
        },
      },
      {
        text: 'ettevõtte kontaktandmed',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.2235412895679474,
        },
      },
      {
        text: 'mis on firma aadress',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.17322680354118347,
        },
      },
      {
        text: 'firma telefoninumber',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.12737733125686646,
        },
      },
      {
        text: 'firma kontaktinfo',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.23985286056995392,
        },
      },
      {
        text: 'ettevõtte meiliaadress',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.24981045722961426,
        },
      },
      {
        text: 'firma kontaktid',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.24369178712368011,
        },
      },
      {
        text: 'ettevõtte e-mail',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.15068015456199646,
        },
      },
      {
        text: 'kui suur on ettevõte?',
        intent: 'common_service_companies_employees',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.1602911502122879,
        },
      },
      {
        text: 'ettevõtte lihtandmete päring',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.12261489778757095,
        },
      },
      {
        text: 'firma lihtandmed',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.122231625020504,
        },
      },
      {
        text: 'info ettevõtte kohta',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.17384576797485352,
        },
      },
      {
        text: 'ettevõtte staatus',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.152103453874588,
        },
      },
      {
        text: 'ettevõtte registrikood nime järgi',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.23526473343372345,
        },
      },
      {
        text: 'firma andmed',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.13637857139110565,
        },
      },
      {
        text: 'firmaga seotud inimesed',
        intent: 'common_service_companies_related_persons',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.48793545365333557,
        },
      },
      {
        text: 'seotud isikud firma kohta',
        intent: 'common_service_companies_related_persons',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.2962723672389984,
        },
      },
      {
        text: 'firma seotud isikud',
        intent: 'common_service_companies_related_persons',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.3547680079936981,
        },
      },
      {
        text: 'seotud isikud ettevõtte kohta',
        intent: 'common_service_companies_related_persons',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.23969267308712006,
        },
      },
      {
        text: 'firmaga seotud isikud',
        intent: 'common_service_companies_related_persons',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.3579951524734497,
        },
      },
      {
        text: 'firma seotud isikute info',
        intent: 'common_service_companies_related_persons',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.2756100594997406,
        },
      },
      {
        text: 'kui palju teenis firma',
        intent: 'common_service_companies_revenue',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.1536971777677536,
        },
      },
      {
        text: 'Kui suur oli suhtelise vaesuse protsent Eestis aastal?',
        intent: 'common_service_estimated_subsistence_minimum',
        intent_prediction: {
          name: 'common_service_CPI',
          confidence: 0.0722300112247467,
        },
      },
      {
        text: 'mis on suhtelise vaesuse määr eestis',
        intent: 'common_service_estimated_subsistence_minimum',
        intent_prediction: {
          name: 'common_service_nba_results',
          confidence: 0.08728419989347458,
        },
      },
      {
        text: 'eur jpy kurss',
        intent: 'common_service_exchange_rate',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.1833977848291397,
        },
      },
      {
        text: 'Millal on HOL2?',
        intent: 'common_service_holidays',
        intent_prediction: {
          name: 'common_service_school_holiday',
          confidence: 0.9886576533317566,
        },
      },
      {
        text: 'Mis kuupäeval on HOL2?',
        intent: 'common_service_holidays',
        intent_prediction: {
          name: 'common_service_school_holiday',
          confidence: 0.962784469127655,
        },
      },
      {
        text: 'Millal toimub HOL2?',
        intent: 'common_service_holidays',
        intent_prediction: {
          name: 'common_service_school_holiday',
          confidence: 0.9882841110229492,
        },
      },
      {
        text: 'kas on võimalik saada andmeid valla põhiselt töötuse muutumisest',
        intent: 'common_service_unemployment_rate',
        intent_prediction: {
          name: 'common_service_CPI',
          confidence: 0.07074567675590515,
        },
      },
      {
        text: 'kuidas meil ilmaga olukord on',
        intent: 'common_teenus_ilm',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative',
          confidence: 0.17314298450946808,
        },
      },
      {
        text: 'millal on hea börsihind olnud 24 tunni sees',
        intent: 'common_teenus_nordpool2',
        intent_prediction: {
          name: 'common_service_holidays',
          confidence: 0.1447332799434662,
        },
      },
      {
        text: 'elektri tunnihind',
        intent: 'common_teenus_nordpool',
        intent_prediction: {
          name: 'common_teenus_nordpool2',
          confidence: 0.2011270672082901,
        },
      },
      {
        text: 'Nordpool praegu',
        intent: 'common_teenus_nordpool',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.211443692445755,
        },
      },
      {
        text: 'elektri tunnihind prageu',
        intent: 'common_teenus_nordpool',
        intent_prediction: {
          name: 'common_teenus_nordpool2',
          confidence: 0.12028630077838898,
        },
      },
      {
        text: 'mis on 24h elektri hinnad',
        intent: 'common_teenus_nordpool',
        intent_prediction: {
          name: 'common_teenus_nordpool2',
          confidence: 0.17581963539123535,
        },
      },
      {
        text: 'parlamendi hääletused',
        intent: 'common_teenus_rk_hääletus',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.20460979640483856,
        },
      },
      {
        text: 'Milline oli viimane riigikogu hääletus?',
        intent: 'common_teenus_rk_hääletus',
        intent_prediction: {
          name: 'common_service_estimated_subsistence_minimum',
          confidence: 0.07738865166902542,
        },
      },
      {
        text: 'Kas saate esitada parlamendiliikme kohalolekuregistri?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_service_estimated_subsistence_minimum',
          confidence: 0.11043661832809448,
        },
      },
      {
        text: 'Kuidas ma saan teada, kas parlamendiliige osales viimasel istungil?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_klienditeenindajale_suunamine',
          confidence: 0.09674753248691559,
        },
      },
      {
        text: 'Mis on parlamendiliikme kohalolekuseis viimaste istungite jaoks?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_service_estimated_subsistence_minimum',
          confidence: 0.10118693113327026,
        },
      },
      {
        text: 'Kas te saate kinnitada parlamendiliikme kohalolekut viimase kuu jooksul?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_service_estimated_subsistence_minimum',
          confidence: 0.09850219637155533,
        },
      },
      {
        text: 'kui palju puudus Kellegi Nimi viimase kuu jooksul riigikogu koosolekutelt?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_service_estimated_subsistence_minimum',
          confidence: 0.10819615423679352,
        },
      },
      {
        text: 'Kellegi Nimi riigikogu istungite kohalolu',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.07457844913005829,
        },
      },
      {
        text: 'aitüma',
        intent: 'common_tänamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.08764678239822388,
        },
      },
      {
        text: 'tnx',
        intent: 'common_tänamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.1083446741104126,
        },
      },
      {
        text: 'miisu',
        intent: 'serviceCatDemo',
        intent_prediction: {
          name: 'common_service_motor_vehicle_tax',
          confidence: 0.10093076527118683,
        },
      },
      {
        text: 'Näita demo näidet',
        intent: 'serviceDemo',
        intent_prediction: {
          name: 'common_service_unemployment_rate',
          confidence: 0.1501578539609909,
        },
      },
      {
        text: 'Näita kuidas demo töötab',
        intent: 'serviceDemo',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.2440377175807953,
        },
      },
      {
        text: 'genereeri juhuslik number',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.14097420871257782,
        },
      },
      {
        text: 'joonista mulle üks number',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.08134869486093521,
        },
      },
      {
        text: 'too üks number välja',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.12800882756710052,
        },
      },
      {
        text: 'anna üks juhuslik arv',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_service_estimated_subsistence_minimum',
          confidence: 0.07554813474416733,
        },
      },
      {
        text: 'palun üks suvaline number',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.07304785400629044,
        },
      },
      {
        text: 'anna mulle juhuslik number',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.07567817717790604,
        },
      },
      {
        text: 'csa',
        intent: 'common_ask_csa',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.113339364528656,
        },
      },
      {
        text: '.csa',
        intent: 'common_ask_csa',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.113339364528656,
        },
      },
      {
        text: 'csa s',
        intent: 'common_ask_csa',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.10423865914344788,
        },
      },
      {
        text: 'csa csa csa',
        intent: 'common_ask_csa',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.12236180901527405,
        },
      },
      {
        text: 'vahet pole',
        intent: 'common_eitamine',
        intent_prediction: {
          name: 'common_service_school_holiday',
          confidence: 0.23831205070018768,
        },
      },
      {
        text: 'kõike paremat',
        intent: 'common_hüvasti_jätmine',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative_popular',
          confidence: 0.12726368010044098,
        },
      },
      {
        text: 'hüvasti',
        intent: 'common_hüvasti_jätmine',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.12230609357357025,
        },
      },
      {
        text: 'nägemist',
        intent: 'common_hüvasti_jätmine',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.17812548577785492,
        },
      },
      {
        text: 'nägemiseni',
        intent: 'common_hüvasti_jätmine',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.14047734439373016,
        },
      },
      {
        text: 'jap',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.1297546774148941,
        },
      },
      {
        text: 'ikka',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.10558556765317917,
        },
      },
      {
        text: 'õige',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.1244642585515976,
        },
      },
      {
        text: 'olgu',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_service_nba_results',
          confidence: 0.10662931948900223,
        },
      },
      {
        text: 'jah, sain vastuse',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.058302365243434906,
        },
      },
      {
        text: 'jah olen',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_service_estimated_subsistence_minimum',
          confidence: 0.11705686897039413,
        },
      },
      {
        text: 'Hästi',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.09967034310102463,
        },
      },
      {
        text: 'Loomulikult',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.07123252004384995,
        },
      },
      {
        text: 'Okei, aitäh!',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.23686766624450684,
        },
      },
      {
        text: 'mhm',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.0683007538318634,
        },
      },
      {
        text: 'Jaa',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.0930383950471878,
        },
      },
      {
        text: 'jh',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.1067405566573143,
        },
      },
      {
        text: 'okei',
        intent: 'common_kinnitamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.14510302245616913,
        },
      },
      {
        text: 'andke inimest',
        intent: 'common_klienditeenindajale_suunamine',
        intent_prediction: {
          name: 'common_service_unemployment_rate',
          confidence: 0.0841270163655281,
        },
      },
      {
        text: 'kas saaksin nõustajaga suhelda',
        intent: 'common_klienditeenindajale_suunamine',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative',
          confidence: 0.2213568389415741,
        },
      },
      {
        text: 'kas avalikest andmebaasidest võib leida mootorikütuste hinnamuutuse statistikat?',
        intent: 'common_service_CPI',
        intent_prediction: {
          name: 'common_service_motor_vehicle_tax',
          confidence: 0.06591813266277313,
        },
      },
      {
        text: 'Otsin tarbijahinna kasvu alates YR0000 kuni tänaseni.',
        intent: 'common_service_CPI',
        intent_prediction: {
          name: 'common_service_unemployment_rate',
          confidence: 0.134770467877388,
        },
      },
      {
        text: 'Toidu hinna statistika',
        intent: 'common_service_CPI',
        intent_prediction: {
          name: 'common_service_estimated_subsistence_minimum',
          confidence: 0.171087384223938,
        },
      },
      {
        text: 'Mis on THI',
        intent: 'common_service_CPI',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.0775606781244278,
        },
      },
      {
        text: 'kui palju kasvas THI eelmisel aastal',
        intent: 'common_service_CPI',
        intent_prediction: {
          name: 'common_service_school_holiday',
          confidence: 0.155883327126503,
        },
      },
      {
        text: 'mis on viimase kuu thi',
        intent: 'common_service_CPI',
        intent_prediction: {
          name: 'common_service_nba_results',
          confidence: 0.11235472559928894,
        },
      },
      {
        text: 'Kust ma saan teada kui suur oli eelmine aasta inflatsioon.',
        intent: 'common_service_CPI',
        intent_prediction: {
          name: 'common_service_motor_vehicle_tax',
          confidence: 0.09723029285669327,
        },
      },
      {
        text: 'firma kasusaajad',
        intent: 'common_service_companies_beneficiaries',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.1835268884897232,
        },
      },
      {
        text: 'firma kasusaajad isikud',
        intent: 'common_service_companies_beneficiaries',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.21431061625480652,
        },
      },
      {
        text: 'ettevõtte kasusaajate info',
        intent: 'common_service_companies_beneficiaries',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.11935806274414062,
        },
      },
      {
        text: 'kasusaajate info ettevõtte kohta',
        intent: 'common_service_companies_beneficiaries',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.16700853407382965,
        },
      },
      {
        text: 'ettevõtte aadress',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.2143767774105072,
        },
      },
      {
        text: 'mis on ettevõtte kontaktnumber?',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.09545305371284485,
        },
      },
      {
        text: 'ettevõtte kontakt',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.1842641681432724,
        },
      },
      {
        text: 'firma aadressi päring',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.2533627450466156,
        },
      },
      {
        text: 'ettevõtte e-posti aadress',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.17299975454807281,
        },
      },
      {
        text: 'ettevõtte kontakt info',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.15625500679016113,
        },
      },
      {
        text: 'firma telefon',
        intent: 'common_service_companies_contactdetails',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.2427833378314972,
        },
      },
      {
        text: 'firma inimesed',
        intent: 'common_service_companies_employees',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.14229907095432281,
        },
      },
      {
        text: 'ettevõtte üldinfo',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.13502028584480286,
        },
      },
      {
        text: 'mis on firma registrikood',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.1361573040485382,
        },
      },
      {
        text: 'ettevõtte info',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.13579872250556946,
        },
      },
      {
        text: 'üldine info ettevõtte kohta',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.12887230515480042,
        },
      },
      {
        text: 'ettevõtte staatuse päring',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.13167181611061096,
        },
      },
      {
        text: 'üldine firma info',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.1454819142818451,
        },
      },
      {
        text: 'lihtandmed ettevõte',
        intent: 'common_service_companies_lihtandmed',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.1886957883834839,
        },
      },
      {
        text: 'kui palju maksis ettevõte riiklikke makse',
        intent: 'common_service_companies_national_taxes',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.17322233319282532,
        },
      },
      {
        text: 'riiklikud maksud',
        intent: 'common_service_companies_national_taxes',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.153959259390831,
        },
      },
      {
        text: 'kes on ettevõttega seotud inimesed?',
        intent: 'common_service_companies_related_persons',
        intent_prediction: {
          name: 'common_service_companies_revenue',
          confidence: 0.12161384522914886,
        },
      },
      {
        text: 'kui suurt tulu tekib firmale aastas',
        intent: 'common_service_companies_revenue',
        intent_prediction: {
          name: 'common_service_motor_vehicle_tax',
          confidence: 0.10861718654632568,
        },
      },
      {
        text: 'firma töötajate pealt makstud maksud',
        intent: 'common_service_companies_workforce_taxes',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.19126150012016296,
        },
      },
      {
        text: 'euro ja eth kurss',
        intent: 'common_service_exchange_rate',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.2055109590291977,
        },
      },
      {
        text: 'mitu gbp on üks euro?',
        intent: 'common_service_exchange_rate',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.13194651901721954,
        },
      },
      {
        text: 'Kui kaua kestab HOL2?',
        intent: 'common_service_school_holiday',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.135935440659523,
        },
      },
      {
        text: 'Tere, kus ma leian andmed töötu kohta?',
        intent: 'common_service_unemployment_rate',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.30220234394073486,
        },
      },
      {
        text: 'Palju inimesi on töötud?',
        intent: 'common_service_unemployment_rate',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.17881067097187042,
        },
      },
      {
        text: 'Palju inimesi on Eestis tööta?',
        intent: 'common_service_unemployment_rate',
        intent_prediction: {
          name: 'common_service_companies_employees',
          confidence: 0.2108120322227478,
        },
      },
      {
        text: 'Kust ma leian teavet viimaste viie avaliku algatuse kohta?',
        intent: 'common_teenus_citizien_initiative',
        intent_prediction: {
          name: 'common_service_nba_results',
          confidence: 0.12250252068042755,
        },
      },
      {
        text: 'Kas te saaksite mulle öelda viis populaarsemat avalikku algatust?',
        intent: 'common_teenus_citizien_initiative_popular',
        intent_prediction: {
          name: 'common_teenus_citizien_initiative',
          confidence: 0.11396763473749161,
        },
      },
      {
        text: 'millal saab odavalt elektrit?',
        intent: 'common_teenus_nordpool2',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.18015828728675842,
        },
      },
      {
        text: 'mis on kõrgeim elektri hind täna?',
        intent: 'common_teenus_nordpool2',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.17502306401729584,
        },
      },
      {
        text: 'millal peaks vältima elektri kasutamist, kui see on kallis?',
        intent: 'common_teenus_nordpool2',
        intent_prediction: {
          name: 'common_service_motor_vehicle_tax',
          confidence: 0.21850721538066864,
        },
      },
      {
        text: 'börs',
        intent: 'common_teenus_nordpool',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.15099814534187317,
        },
      },
      {
        text: 'elektribörs',
        intent: 'common_teenus_nordpool',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.11522980034351349,
        },
      },
      {
        text: 'Nordpool hetkel',
        intent: 'common_teenus_nordpool',
        intent_prediction: {
          name: 'common_tänamine',
          confidence: 0.1425715982913971,
        },
      },
      {
        text: 'elektri börsihind',
        intent: 'common_teenus_nordpool',
        intent_prediction: {
          name: 'common_service_companies_workforce_taxes',
          confidence: 0.1970009058713913,
        },
      },
      {
        text: 'viimased riigikogu hääletused',
        intent: 'common_teenus_rk_hääletus',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.10582054406404495,
        },
      },
      {
        text: 'viimased viis parlamendi hääletust',
        intent: 'common_teenus_rk_hääletus',
        intent_prediction: {
          name: 'common_klienditeenindajale_suunamine',
          confidence: 0.10470400005578995,
        },
      },
      {
        text: 'mille üle on viimasel ajal hääletatud parlamendis?',
        intent: 'common_teenus_rk_hääletus',
        intent_prediction: {
          name: 'common_service_estimated_subsistence_minimum',
          confidence: 0.08570612967014313,
        },
      },
      {
        text: 'Sooviksin teada kuidas kulges viimane hääletus riigikogus?',
        intent: 'common_teenus_rk_hääletus',
        intent_prediction: {
          name: 'common_service_nba_results',
          confidence: 0.10404457151889801,
        },
      },
      {
        text: 'parlamendi viimane hääletus',
        intent: 'common_teenus_rk_hääletus',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.1398373544216156,
        },
      },
      {
        text: 'riigikogu hääletus',
        intent: 'common_teenus_rk_hääletus',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.17135998606681824,
        },
      },
      {
        text: 'Kust ma näen parlamendiliikme kohaloleku andmeid?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.1282433420419693,
        },
      },
      {
        text: 'Kas te saaksite kontrollida, kas parlamendiliige oli hiljutisel parlamendi koosolekul kohal?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_service_school_holiday',
          confidence: 0.17913764715194702,
        },
      },
      {
        text: 'Kuidas ma saan juurdepääsu parlamendiliikme kohalolekuregistrile?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_teenus_rk_hääletus',
          confidence: 0.06403439491987228,
        },
      },
      {
        text: 'Kas on olemas andmeid, mis näitavad parlamendiliikme kohalolekut hiljutistel istungitel?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_service_school_holiday',
          confidence: 0.08517935127019882,
        },
      },
      {
        text: 'Kust ma saan vaadata parlamendiliikme kohaloleku ajalugu?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_tervitus',
          confidence: 0.07121296226978302,
        },
      },
      {
        text: 'Kas Kellegi Nimi oli hiljutisel parlamendi istungil kohal?',
        intent: 'common_teenus_rk_isiku_kohalolu',
        intent_prediction: {
          name: 'common_service_school_holiday',
          confidence: 0.09017357230186462,
        },
      },
      {
        text: 'hei kah',
        intent: 'common_tervitus',
        intent_prediction: {
          name: 'common_service_unemployment_rate',
          confidence: 0.11729322373867035,
        },
      },
      {
        text: 'tänan väga',
        intent: 'common_tänamine',
        intent_prediction: {
          name: 'common_eitamine',
          confidence: 0.2248394787311554,
        },
      },
      {
        text: 'Käivita testteenus.',
        intent: 'serviceDemo',
        intent_prediction: {
          name: 'common_service_unemployment_rate',
          confidence: 0.2043461948633194,
        },
      },
      {
        text: 'Tee mulle kiire demo',
        intent: 'serviceDemo',
        intent_prediction: {
          name: 'common_service_unemployment_rate',
          confidence: 0.13574667274951935,
        },
      },
      {
        text: 'Kasutan demo teenust',
        intent: 'serviceDemo',
        intent_prediction: {
          name: 'common_service_unemployment_rate',
          confidence: 0.18550564348697662,
        },
      },
      {
        text: 'Palun tee demo',
        intent: 'serviceDemo',
        intent_prediction: {
          name: 'common_service_unemployment_rate',
          confidence: 0.1929667592048645,
        },
      },
      {
        text: 'kas saad öelda mingi numbri',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_service_nba_results',
          confidence: 0.09872942417860031,
        },
      },
      {
        text: 'mõtle välja mingi number',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_teenus_ilm',
          confidence: 0.07906141132116318,
        },
      },
      {
        text: 'ütle ükskõik mis number',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_teenus_nordpool2',
          confidence: 0.1453184187412262,
        },
      },
      {
        text: 'kas saad anda suvalise numbri',
        intent: 'serviceRandom',
        intent_prediction: {
          name: 'common_service_motor_vehicle_tax',
          confidence: 0.05955306068062782,
        },
      },
    ],
  },
  entity_evaluation: {
    report: {},
    precision: null,
    f1_score: null,
    errors: [],
  },
  response_selection_evaluation: {
    report: {},
    precision: null,
    f1_score: null,
    errors: [],
  },
};

const IntentsOverview: FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');

  const { data: models } = useQuery<Model[]>({
    queryKey: ['models'],
  });

  const [modelInUse, setModelInUse] = useState(false);
  const [trainedDate, setTrainedDate] = useState('');
  const [accuracyValue, setAccuracyValue] = useState(0);

  const { data, refetch } = useQuery<IntentsReport>({
    queryKey: [`model/get-report-by-name?fileName=${selectedModelId}`],
    enabled: false,
  });
  const nonIntents = isHiddenFeaturesEnabled ? ['accuracy', 'macro avg', 'weighted avg', 'micro avg'] : [];

  useEffect(() => {
    if (!models) return;
    let deployed = models.find((model) => model.state === 'DEPLOYED');
    if (!deployed) deployed = models.find((model) => model.state === 'READY');
    if (!deployed) deployed = models?.[0];
    setSelectedModelId(deployed?.id || 0);
  }, [models]);

  const modelsOptions = useMemo(() => {
    if (!models) return [];
    return models.map((model) => ({ label: model.name, value: String(model.id) }));
  }, [models]);

  useEffect(() => {
    if (!selectedModelId) return;
    refetch();
    setStatesById(selectedModelId);
  }, [selectedModelId]);

  useEffect(() => {
    if (intentsReport?.intent_evaluation?.report) {
      setAccuracyValue(intentsReport?.intent_evaluation?.report['accuracy']);
    }
  }, [intentsReport]);

  console.log(intentsReport?.intent_evaluation?.report);

  // const isIntentMetrics = (value: any): value is IntentMetrics => {
  //   return (
  //     typeof value === 'object' &&
  //     value !== null &&
  //     typeof value.precision === 'number' &&
  //     typeof value.recall === 'number' &&
  //     typeof value['f1-score'] === 'number' &&
  //     typeof value.support === 'number'
  //   );
  // };

  const formattedIntentsReport = useMemo(
    () =>
      intentsReport
        ? Object.keys(intentsReport.intent_evaluation.report).map((intent) => {
            const report = intentsReport.intent_evaluation.report as Record<string, number | Metrics>;
            const metrics = report[intent] as Metrics;
            return {
              intent,
              ...metrics,
            };
          })
        : [],
    []
  );

  const intentsReportColumns = useMemo(() => getColumns({ accuracyValue, nonIntents }), [accuracyValue]);

  const setStatesById = (modelId: string) => {
    if (!models) {
      return;
    }
    const selectedModel = models.find((m) => m.name === modelId);
    setModelInUse(selectedModel?.state.toUpperCase() === 'DEPLOYED');
    const date = selectedModel?.lastTrained.split('T')[0] ?? '';
    const [year, month, day] = date.split('-');
    setTrainedDate(`${day}.${month}.${year}`);
  };

  return (
    <>
      <h1>{t('training.mba.intentsOverview')}</h1>

      <Card>
        <Track gap={16}>
          {models && (
            <FormSelect
              label={t('training.mba.modelOverview')}
              name="model"
              fitContent
              options={modelsOptions}
              value={String(selectedModelId)}
              onSelectionChange={(model) => {
                refetch();
                setSelectedModelId(model?.value ?? '');
                setStatesById(model?.value ?? '');
              }}
            />
          )}
          {modelInUse && (
            <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
              <Icon icon={<MdOutlineSettingsInputAntenna />} size="medium" />
              <p>{t('training.mba.modelInUse')}</p>
            </Track>
          )}
          {trainedDate && (
            <p style={{ color: '#4D4F5D', whiteSpace: 'nowrap' }}>
              {t('training.mba.trained')}: {trainedDate}
            </p>
          )}
        </Track>
      </Card>

      <Card
        header={
          <FormInput
            label={t('global.search')}
            hideLabel
            name="search"
            placeholder={t('global.search') + '...'}
            onChange={(e) => setFilter(e.target.value)}
          />
        }
      >
        <DataTable
          data={formattedIntentsReport}
          columns={intentsReportColumns}
          globalFilter={filter}
          setGlobalFilter={setFilter}
          columnVisibility={isHiddenFeaturesEnabled ? {} : { precision: false, recall: false, suggestion: false }}
        />
      </Card>
    </>
  );
};

export default withAuthorization(IntentsOverview, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
