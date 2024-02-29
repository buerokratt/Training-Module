import { FC, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper, Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { MdOutlineSettingsInputAntenna } from 'react-icons/md';

import { Button, Card, DataTable, Dialog, Icon, Track } from 'components';
import { Model, ModelStateType, UpdateModelDTO } from 'types/model';
import { activateModel, deleteModel } from 'services/models';
import { useToast } from 'hooks/useToast';

const Models: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [modelConfirmation, setModelConfirmation] = useState<string | number | null>(null);
  const [deletableModel, setDeletableModel] = useState<string | number | null>(null);
  const { data: models } = useQuery<Model[]>({
    queryKey: ['models', 'prod'],
  });

  const activateModelMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: UpdateModelDTO }) => activateModel(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['models', 'selected-model']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Model activated',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setModelConfirmation(null),
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
      cell: (props) => (
        <Button appearance='text' onClick={() => setSelectedModel(props.row.original)}>
          {props.getValue()}
        </Button>
      ),
    }),
    columnHelper.display({
      id: 'compare',
      cell: (props) => (
        <Link to={String(props.row.original.id)} style={{ color: '#005AA3' }}>
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
    columnHelper.accessor('state', {
      header: t('training.mba.state') || '',
      cell: (props) => renderState(props.getValue()),
    }),
    columnHelper.accessor('state', {
      header: t('training.mba.live') || '',
      cell: (props) => renderDeployedIcon(props.getValue()),
      meta: { size: '1%' },
    }),
  ], [columnHelper, t]);

  const renderState = (value: ModelStateType) => {
    if(!value) {
      return null;
    }
    return (
      <span style={{ color: getModelStatusColor(value) }}>
        {value}
      </span>
    )
  }

  const renderDeployedIcon = (value: ModelStateType) => {
    if(value !== 'DEPLOYED') {
      return null;
    }

    return (
      <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
        <Icon icon={<MdOutlineSettingsInputAntenna fontSize={24} />} size='medium' />
        <p>{t('training.mba.modelInUse')}</p>
      </Track>
    );
  }

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
            {selectedModel.state === 'DEPLOYED' ? (
              <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
                <Icon icon={<MdOutlineSettingsInputAntenna fontSize={24} />} size='medium' />
                <p>{t('training.mba.modelInUse')}</p>
              </Track>
            ) : (
              <Button appearance='success'
                      onClick={() => setModelConfirmation(selectedModel.id)}>{t('training.mba.activateModel')}</Button>
            )}
          </Track>
        </Card>
      )}

      {models && (
        <Card header={<h2 className='h3'>{t('training.mba.allModels')}</h2>}>
          <DataTable data={models} columns={modelsColumns} sortable meta={
            {
              getRowStyles: (row: Row<Model>) => ({
                backgroundColor: row.original.id === selectedModel?.id ? '#E1E2E5' : undefined,
              }),
            }
          } />
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

      {selectedModel && modelConfirmation !== null && (
        <Dialog
          title={t('training.mba.activateModel')}
          onClose={() => setModelConfirmation(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setModelConfirmation(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => activateModelMutation.mutate({
                  id: modelConfirmation,
                  data: { name: selectedModel.name, state: 'DEPLOYED' },
                })}
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

function getModelStatusColor(status: ModelStateType): string {
  switch (status) {
    case 'DEPLOYED': return '#385';
    case 'TRAINED': return '#FB0';
    case 'FAILED': return '#D22';
    case 'REMOVED': return '#AAA';
    default: return '#000';
  }
}

export default Models;
