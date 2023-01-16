import { FC, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { MdCheckCircleOutline } from 'react-icons/md';

import { Button, Card, DataTable, Dialog, Icon, Track } from 'components';
import { Model } from 'types/model';
import { deleteModel } from 'services/models';
import { useToast } from 'hooks/useToast';

const Models: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deletableModel, setDeletableModel] = useState<string | number | null>(null);
  const { data: selectedModel } = useQuery<Model>({
    queryKey: ['selected-model'],
  });
  const { data: models } = useQuery<Model[]>({
    queryKey: ['models'],
  });

  const deleteModelMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteModel(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['models', 'selected-model']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Model deleted',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setDeletableModel(null),
  });

  const columnHelper = createColumnHelper<Model>();

  const modelsColumns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('global.name') || '',
    }),
    columnHelper.display({
      id: 'compare',
      cell: (props) => (
        <Link to='#' style={{ color: '#005AA3' }}>
          {t('training.mba.compareResults')}
        </Link>
      ),
    }),
    columnHelper.accessor('lastTrained', {
      header: t('training.mba.lastTrained') || '',
      cell: (props) =>
        props.getValue()
          ? format(new Date(props.getValue()), 'dd.MM.yyyy HH:ii')
          : null,
    }),
    columnHelper.accessor('active', {
      header: t('training.mba.live') || '',
      cell: (props) => props.getValue() ? (
        <Icon
          icon={
            <MdCheckCircleOutline
              color={'rgba(0, 0, 0, 0.54)'}
            />
          }
        />
      ) : null,
    }),
  ], [columnHelper, t]);

  return (
    <>
      <h1>{t('training.mba.modelComparison')}</h1>

      {selectedModel && (
        <Card header={<h2 className='h3'>{t('training.mba.selectedModel')}</h2>}>
          <Track gap={16} isMultiline>
            <p style={{ flex: 1, whiteSpace: 'nowrap' }}>{selectedModel.name}</p>
            <Button appearance='secondary'>{t('training.mba.downloadModel')}</Button>
            <Button appearance='secondary'>{t('training.mba.downloadDataset')}</Button>
            <Button appearance='secondary'>{t('training.mba.viewIntentsPrecision')}</Button>
            <Button appearance='error'
                    onClick={() => setDeletableModel(selectedModel.id)}>{t('global.delete')}</Button>
            <Button appearance='success'>{t('training.mba.activateModel')}</Button>
          </Track>
        </Card>
      )}

      {models && (
        <Card header={<h2 className='h3'>{t('training.mba.allModels')}</h2>}>
          <DataTable data={models} columns={modelsColumns} />
        </Card>
      )}

      {deletableModel !== null && (
        <Dialog
          title={t('training.mba.deleteModel')}
          onClose={() => setDeletableModel(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableModel(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => deleteModelMutation.mutate({ id: deletableModel })}
              >
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}
    </>
  );
};

export default Models;
