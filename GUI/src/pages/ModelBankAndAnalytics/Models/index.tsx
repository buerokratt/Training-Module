import { FC, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Button, Card, DataTable, Track } from 'components';
import { Model } from 'types/model';
import { format } from 'date-fns';

const Models: FC = () => {
  const { t } = useTranslation();
  const { data: models } = useQuery<Model[]>({
    queryKey: ['models'],
  });
  const columnHelper = createColumnHelper<Model>();

  const modelsColumns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('global.name') || '',
    }),
    columnHelper.accessor('lastTrained', {
      header: t('training.mba.lastTrained') || '',
      cell: (props) => <>{format(new Date(props.getValue()), 'dd.MM.yyyy HH:ii')}</>,
    }),
    columnHelper.accessor('active', {
      header: t('training.mba.live') || '',
    }),
  ], [columnHelper, t]);

  return (
    <>
      <h1>{t('training.mba.modelComparison')}</h1>

      <Card header={<h2 className='h3'>{t('training.mba.selectedModel')}</h2>}>
        <Track gap={16}>
          <p style={{ flex: 1 }}>20220322-155051-potential-proton.tar.gz</p>
          <Button appearance='secondary'>{t('training.mba.downloadModel')}</Button>
          <Button appearance='secondary'>{t('training.mba.viewIntentsPrecision')}</Button>
          <Button appearance='error'>{t('global.delete')}</Button>
          <Button appearance='success'>{t('training.mba.activateModel')}</Button>
        </Track>
      </Card>

      {models && (
        <Card header={<h2 className='h3'>{t('training.mba.allModels')}</h2>}>
          <DataTable data={models} columns={modelsColumns} />
        </Card>
      )}
    </>
  );
};

export default Models;
