import { FC, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdOutlineSettingsInputAntenna } from 'react-icons/md';
import { format } from 'date-fns';

import { Button, Card, DataTable, FormInput, FormSelect, Icon, Tooltip, Track } from 'components';
import { IntentsReport } from 'types/intentsReport';
import { truncateNumber } from 'utils/truncateNumber';
import { Model } from 'types/model';

const IntentsOverview: FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const { data: intentsReport } = useQuery<IntentsReport>({
    queryKey: ['intents-report'],
  });
  const { data: models } = useQuery<Model[]>({
    queryKey: ['models'],
  });

  const formattedIntentsReport = useMemo(
    () => intentsReport
      ? Object.keys(intentsReport).map((intent) => ({ intent, ...intentsReport[intent] }))
      : [],
    [intentsReport],
  );

  const columnHelper = createColumnHelper<typeof formattedIntentsReport[0]>();

  const intentsReportColumns = useMemo(() => [
    columnHelper.accessor('intent', {
      header: t('training.mba.intent') || '',
    }),
    columnHelper.display({
      id: 'detail',
      cell: (props) => (
        <Link
          to={props.row.original.intent.startsWith('common')
            ? `/training/common-intents?intent=${props.row.original.intent}#tabs`
            : `/training/intents?intent=${props.row.original.intent}#tabs`
          }
          style={{ color: '#005AA3' }}>
          {t('training.mba.gotoExample')}
        </Link>
      ),
    }),
    columnHelper.accessor('support', {
      header: t('training.mba.examples') || '',
      cell: (props) => (
        <div style={{
          margin: '-12px -24px -12px -16px',
          padding: '12px 24px 12px 16px',
          backgroundColor:
            props.row.original['f1-score'] >= 0.8
              ? '#D9E9DF'
              : props.row.original['f1-score'] <= 0.3 ? '#F7DBDB' : undefined,
        }}>{props.getValue()}</div>
      ),
    }),
    columnHelper.accessor('precision', {
      header: t('training.mba.precision') || '',
      cell: (props) => (
        <div style={{
          margin: '-12px -24px -12px -16px',
          padding: '12px 24px 12px 16px',
          backgroundColor:
            props.row.original['f1-score'] >= 0.8
              ? '#D9E9DF'
              : props.row.original['f1-score'] <= 0.3 ? '#F7DBDB' : undefined,
        }}>{truncateNumber(props.getValue())}</div>
      ),
    }),
    columnHelper.accessor('recall', {
      header: t('training.mba.recall') || '',
      cell: (props) => (
        <div style={{
          margin: '-12px -24px -12px -16px',
          padding: '12px 24px 12px 16px',
          backgroundColor:
            props.row.original['f1-score'] >= 0.8
              ? '#D9E9DF'
              : props.row.original['f1-score'] <= 0.3 ? '#F7DBDB' : undefined,
        }}>{props.getValue().toPrecision(2)}</div>
      ),
    }),
    columnHelper.accessor('f1-score', {
      header: () => (
        <Tooltip content={t('training.mba.f1Tooltip')}>
          <span>{t('training.mba.f1') || ''}</span>
        </Tooltip>
      ),
      cell: (props) => (
        <div style={{
          margin: '-12px -24px -12px -16px',
          padding: '12px 24px 12px 16px',
          backgroundColor:
            props.row.original['f1-score'] >= 0.8
              ? '#D9E9DF'
              : props.row.original['f1-score'] <= 0.3 ? '#F7DBDB' : undefined,
        }}>{truncateNumber(props.getValue())}</div>
      ),
    }),
    columnHelper.display({
      id: 'suggestion',
      header: t('training.mba.suggestion') || '',
      cell: (props) => (
        <div style={{
          margin: '-12px -24px -12px -16px',
          padding: '12px 24px 12px 16px',
          backgroundColor:
            props.row.original['f1-score'] >= 0.8
              ? '#D9E9DF'
              : props.row.original['f1-score'] <= 0.3 ? '#F7DBDB' : undefined,
        }}>
          {props.row.original.support < 30 ? t('training.mba.addExamples') : <>&nbsp;</>}
        </div>
      ),
    }),
  ], [columnHelper, t]);

  return (
    <>
      <h1>{t('training.mba.intentsOverview')}</h1>

      <Card>
        <Track gap={16}>
          {models && (
            <FormSelect
              label={t('training.mba.modelInUse')}
              hideLabel
              name='model'
              options={models.map((model) => ({ label: model.name, value: String(model.id) }))}
              defaultValue={models.find((model) => model.active)?.id + ''}
            />
          )}
          <Button>{t('global.choose')}</Button>
          <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
            <Icon icon={<MdOutlineSettingsInputAntenna />} size='medium' />
            <p>{t('training.mba.modelInUse')}</p>
          </Track>
          <p style={{ color: '#4D4F5D', whiteSpace: 'nowrap' }}>
            {t('training.mba.trained')}: {format(new Date(), 'dd.MM.yyyy')}
          </p>
        </Track>
      </Card>

      <Card header={
        <FormInput
          label={t('global.search')}
          hideLabel
          name='search'
          placeholder={t('global.search') + '...'}
          onChange={(e) => setFilter(e.target.value)}
        />
      }>
        <DataTable
          data={formattedIntentsReport}
          columns={intentsReportColumns}
          globalFilter={filter}
          setGlobalFilter={setFilter}
        />
      </Card>
    </>
  );
};

export default IntentsOverview;
