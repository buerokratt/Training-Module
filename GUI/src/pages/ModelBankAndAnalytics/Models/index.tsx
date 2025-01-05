import { FC, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper, Row, SortingState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import { MdOutlineSettingsInputAntenna } from 'react-icons/md';
import './Models.scss'

import {
  Button,
  Card,
  DataTable,
  Dialog,
  Icon,
  Loader,
  Track,
} from 'components';
import { Model, ModelStateType, UpdateModelDTO } from 'types/model';
import { activateModel, deleteModel } from 'services/models';
import { useToast } from 'hooks/useToast';
import { DATETIME_FORMAT } from 'utils/datetime-fromat';
import i18n from '../../../../i18n';
import withAuthorization, { ROLES } from 'hoc/with-authorization';

const Models: FC = () => {
  const MODEL_FETCH_INTERVAL = 5000;
  const MODEL_FETCH_TIMEOUT = 120000;

  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [currentlyLoadedModel, setCurrentlyLoadedModel] = useState<Model>();
  const [previouslyLoadedModel, setPreviouslyLoadedModel] = useState<Model>();
  const [isFetching, setIsFetching] = useState(false);
  const [modelConfirmation, setModelConfirmation] = useState<
    string | number | null
  >(null);
  const [deletableModel, setDeletableModel] = useState<string | number | null>(
    null
  );
  const { data: models, refetch } = useQuery<Model[]>({
    queryKey: ['models'],
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const activateModelMutation = useMutation({
    mutationFn: ({ data }: { data: UpdateModelDTO }) => activateModel(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['models', 'selected-model']);
      setIsFetching(true);
      setCurrentlyLoadedModel(selectedModel);
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
      await queryClient.invalidateQueries(['model', 'delete-model']);
      refetch();
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.modelDeleted'),
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

  const modelsColumns = useMemo(() => getColumns(setSelectedModel), []);

  useEffect(() => {
    const deployedModel = models?.find((m) => m.state === 'DEPLOYED');
    setSelectedModel(deployedModel);
    setCurrentlyLoadedModel(deployedModel);
    setPreviouslyLoadedModel(deployedModel);
  }, [models]);

  useEffect(() => {
    if (isFetching) {
      const intervalId = setInterval(() => {
        refetch();
      }, MODEL_FETCH_INTERVAL);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setIsFetching(false);
        toast.open({
          type: 'error',
          title: t('global.notificationError'),
          message: t('toast.modelActivationTimedOut'),
        });
      }, MODEL_FETCH_TIMEOUT);

      if (currentlyLoadedModel?.id === previouslyLoadedModel?.id) {
        setIsFetching(false);
        toast.open({
          type: 'success',
          title: t('global.notification'),
          message: t('toast.modelActivated'),
        });
      }

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [
    isFetching,
    refetch,
    currentlyLoadedModel,
    previouslyLoadedModel,
    toast,
    t,
  ]);

  return (
    <>
      <h1>{t('training.mba.models')}</h1>

      {selectedModel && (
        <Card
          header={<h2 className="h3">{t('training.mba.selectedModel')}</h2>}
        >
          <Track gap={16} isMultiline>
            <p style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {`${i18n.t('training.mba.version')} ${
                selectedModel.versionNumber
              }`}
            </p>
            <p style={{ whiteSpace: 'nowrap' }}>{`(${selectedModel.name})`}</p>

            {selectedModel.state === 'DEPLOYED' && (
              <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
                <Icon
                  icon={<MdOutlineSettingsInputAntenna fontSize={24} />}
                  size="medium"
                />
                <p>{t('training.mba.modelInUse')}</p>
              </Track>
            )}

            <Button
              appearance="error"
              disabled={selectedModel.state === 'DEPLOYED'}
              onClick={() => setDeletableModel(selectedModel?.id ?? null)}
              style={{ marginLeft: 'auto' }}
            >
              {t('global.delete')}
            </Button>

            {selectedModel.state !== 'DEPLOYED' && (
              <Button
                appearance="success"
                disabled={isFetching}
                onClick={() => setModelConfirmation(selectedModel.id)}
              >
                {isFetching &&
                currentlyLoadedModel?.id !== previouslyLoadedModel?.id ? (
                  <Loader />
                ) : (
                  t('training.mba.activateModel')
                )}
              </Button>
            )}
          </Track>
        </Card>
      )}

      {models && (
        <Card header={<h2 className="h3">{t('training.mba.allModels')}</h2>}>
          <DataTable
            data={models}
            selectedRow={(row) => row.original.versionNumber === selectedModel?.versionNumber}
            columns={modelsColumns}
            sortable
            sorting={sorting}
            setSorting={setSorting}
            setSelectedRow={(row: Row<Model>) => setSelectedModel(row.original)}
            meta={{
              getRowStyles: (row: Row<Model>) => ({
                cursor: 'pointer'
              }),
            }}
          />
        </Card>
      )}

      {deletableModel !== null && (
        <Dialog
          title={t('training.mba.deleteModel')}
          onClose={() => setDeletableModel(null)}
          footer={
            <>
              <Button
                appearance="secondary"
                onClick={() => setDeletableModel(null)}
              >
                {t('global.no')}
              </Button>
              <Button
                appearance="error"
                onClick={() =>
                  deleteModelMutation.mutate({ id: deletableModel })
                }
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
              <Button
                appearance="secondary"
                onClick={() => setModelConfirmation(null)}
              >
                {t('global.no')}
              </Button>
              <Button
                appearance="primary"
                onClick={() =>
                  activateModelMutation.mutate({
                    data: { versionNumber: selectedModel.versionNumber },
                  })
                }
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

const getColumns = (setSelectedModel: (model: Model) => void) => {
  const columnHelper = createColumnHelper<Model>();

  const renderDeployedIcon = (value: ModelStateType) => {
    if (value !== 'DEPLOYED') {
      return null;
    }

    return (
      <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
        <Icon
          icon={<MdOutlineSettingsInputAntenna fontSize={24} />}
          size="medium"
        />
        <p>{i18n.t('training.mba.modelInUse')}</p>
      </Track>
    );
  };

  return [
    columnHelper.accessor('versionNumber', {
      header: i18n.t('training.mba.version') ?? '',
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor('name', {
      header: i18n.t('global.name') ?? '',
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor('lastTrained', {
      header: i18n.t('training.mba.lastTrained') ?? '',
      cell: (props) =>
        props.getValue()
          ? format(new Date(props.getValue()), DATETIME_FORMAT)
          : null,
    }),
    columnHelper.accessor('state', {
      header: i18n.t('training.mba.live') ?? '',
      cell: (props) => renderDeployedIcon(props.getValue()),
      meta: { size: '1%' },
    }),
  ];
};

export default withAuthorization(Models, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
