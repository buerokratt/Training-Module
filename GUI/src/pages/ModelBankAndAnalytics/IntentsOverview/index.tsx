import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdOutlineSettingsInputAntenna } from 'react-icons/md';
import { format } from 'date-fns';

import { Button, Card, DataTable, FormInput, FormSelect, Icon, Track } from 'components';
import { IntentsReport } from 'types/intentsReport';

const IntentsOverview: FC = () => {
  const { t } = useTranslation();
  const { data: intentsReport } = useQuery<IntentsReport>({
    queryKey: ['intents-report'],
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
      header: t('training.intents.titleOne') || '',
    }),
    columnHelper.display({
      id: 'detail',
      // cell: (props) =>
    }),
    columnHelper.accessor('support', {
      header: t('training.mba.support') || '',
    }),
    columnHelper.accessor('precision', {
      header: t('training.mba.precision') || '',
    }),
    columnHelper.accessor('recall', {
      header: t('training.mba.recall') || '',
    }),
    columnHelper.accessor('f1-score', {
      header: 'F1',
    }),
  ], [columnHelper, t]);

  return (
    <>
      <h1>{t('training.mba.intentsOverview')}</h1>

      <Card>
        <Track gap={16}>
          <FormSelect label='folder' hideLabel name='' options={[]} />
          <Button>{t('global.choose')}</Button>
          <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
            <Icon icon={<MdOutlineSettingsInputAntenna />} size='medium' />
            <p>{t('training.mba.modelInUse')}</p>
          </Track>
          <p style={{
            color: '#4D4F5D',
            whiteSpace: 'nowrap',
          }}>{t('training.mba.trained')}: {format(new Date(), 'dd.MM.yyyy')}</p>
        </Track>
      </Card>

      <Card header={
        <FormInput
          label={t('global.search')}
          hideLabel
          name='search'
          placeholder={t('global.search') + '...'}
        />
      }>
        <DataTable data={formattedIntentsReport} columns={intentsReportColumns} />
      </Card>
    </>
  );
};

export default IntentsOverview;
