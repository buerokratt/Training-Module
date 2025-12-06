import { FC, useEffect, useMemo, useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper, Row, SortingState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import { MdOutlineModeEditOutline, MdOutlineSettingsInputAntenna, MdOutlineClose, MdCheck } from 'react-icons/md';
import './Models.scss'

import {
  Button,
  Card,
  DataTable,
  Dialog,
  FormTextarea,
  Icon,
  Loader,
  Track,
  Tooltip,
} from 'components';
import { Model, ModelStateType, UpdateModelDTO } from 'types/model';
import { activateModel, deleteModel, addModelDescription } from 'services/models';
import { useToast } from 'hooks/useToast';
import { DATETIME_FORMAT } from 'utils/datetime-fromat';
import i18n from '../../../../i18n';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';

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
  const [editableRow, setEditableRow] = useState<{ modelName: string; description: string } | null>(null);
  const editingDescriptionRef = useRef<string>('');

  useDocumentEscapeListener(() => {
    setEditableRow(null);
    editingDescriptionRef.current = '';
  });

  const getColumns = (
    setSelectedModel: (model: Model) => void,
    editableRow: { modelName: string; description: string } | null
  ) => {
    const columnHelper = createColumnHelper<Model>();

    const renderDeployedIcon = (value: ModelStateType) => {
      if (value !== 'DEPLOYED') {
        return null;
      }

      return (
        <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
          <Icon icon={<MdOutlineSettingsInputAntenna fontSize={24} />} size="medium" />
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
      columnHelper.accessor('description', {
        header: i18n.t('training.mba.description') ?? '',
        cell: (props) =>
          buildTextCell(
            props.row.original.name,
            props.getValue() || '',
            editableRow?.modelName === props.row.original.name,
            props.row.original
          ),
      }),
      columnHelper.accessor('lastTrained', {
        header: i18n.t('training.mba.lastTrained') ?? '',
        cell: (props) => (props.getValue() ? format(new Date(props.getValue()), DATETIME_FORMAT) : null),
      }),
      columnHelper.accessor('state', {
        header: i18n.t('training.mba.live') ?? '',
        cell: (props) => renderDeployedIcon(props.getValue()),
        meta: { size: '1%' },
      }),
    ];
  };

  const buildTextCell = (modelName: string, description: string, isEditable: boolean, model: Model) => {
    const MAX_DISPLAY_LENGTH = 50;
    const truncatedDescription = description.length > MAX_DISPLAY_LENGTH 
      ? description.substring(0, MAX_DISPLAY_LENGTH) + '...' 
      : description;
    const shouldShowTooltip = description.length > MAX_DISPLAY_LENGTH;

    const handleSave = () => {
      const currentValue = editingDescriptionRef.current ?? description;
      if (editingDescriptionRef.current === description) {
        setEditableRow(null);
        editingDescriptionRef.current = '';
        return;
      }
      addDescriptionMutation.mutate({
        fileName: modelName,
        description: currentValue,
      });
    };

    const handleCancel = () => {
      setEditableRow(null);
      editingDescriptionRef.current = '';
    };

    if (isEditable) {
      return (
        <Track gap={8} align="center">
          <FormTextarea
            label="label"
            name="description"
            defaultValue={description}
            placeholder={t('training.mba.enterModelDescription').toString()}
            hideLabel
            minRows={1}
            onChange={(e) => {
              editingDescriptionRef.current = e.target.value;
            }}
            style={{ flex: 1 }}
          />
          <Track direction="vertical" gap={4}>
            <Button
              appearance="text"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              style={{ padding: '4px' }}
            >
              <Icon icon={<MdCheck size={20} color="#308653" />} size="medium" />
            </Button>
            <Button
              appearance="text"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              style={{ padding: '4px' }}
            >
              <Icon icon={<MdOutlineClose size={20} color="#D73E3E" />} size="medium" />
            </Button>
          </Track>
        </Track>
      );
    }

    return (
      <Track gap={8} align="center">
        {description && shouldShowTooltip && (
          <Tooltip content={description}>
            <p style={{ margin: 0 }}>{truncatedDescription}</p>
          </Tooltip>
        )}
        {description && !shouldShowTooltip && <p style={{ margin: 0 }}>{truncatedDescription}</p>}
        <Button
          appearance="text"
          onClick={(e) => {
            e.stopPropagation();
            editingDescriptionRef.current = description;
            setEditableRow({ modelName, description });
          }}
          style={{ padding: '4px', flexShrink: 0 }}
        >
          {!description && i18n.t('global.add')}
          <Icon icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />} />
        </Button>
      </Track>
    );
  };

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

  const addDescriptionMutation = useMutation({
    mutationFn: ({ fileName, description }: { fileName: string; description: string }) => 
      addModelDescription(fileName, description.trim()),
    onSuccess: async (_, variables) => {
      queryClient.setQueryData<Model[]>(['models'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((model) =>
          model.name === variables.fileName
            ? { ...model, description: variables.description }
            : model
        );
      });
      
      await queryClient.invalidateQueries({ queryKey: ['models'] });
      await queryClient.refetchQueries({ queryKey: ['models'] });
      
      if (selectedModel?.name === variables.fileName) {
        setSelectedModel((prev) => 
          prev ? { ...prev, description: variables.description } : prev
        );
      }
      
      setEditableRow(null);
      editingDescriptionRef.current = '';
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.modelDescriptionUpdated'),
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
  });

  const modelsColumns = useMemo(
    () => getColumns(setSelectedModel, editableRow),
    [editableRow]
  );

  useEffect(() => {
    const deployedModel = models?.find((m) => m.state === 'DEPLOYED');
    setSelectedModel(deployedModel);
    setCurrentlyLoadedModel(deployedModel);
    setPreviouslyLoadedModel(deployedModel);

    const activatingModel = models?.find((m) => m.state === 'ACTIVATING')
    if (activatingModel) {
      setSelectedModel(activatingModel);
      setCurrentlyLoadedModel(activatingModel);
      setIsFetching(true);
    }
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
        <Card header={<h2 className="h3">{t('training.mba.allModels')}</h2>} style={{ height: 'auto', overflow: 'auto' }}>
          <DataTable
            data={models}
            selectedRow={(row) => row.original.versionNumber === selectedModel?.versionNumber}
            columns={modelsColumns}
            sortable
            customMaxHeight={50}
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
                    data: { versionNumber: selectedModel.versionNumber, name: selectedModel.name },
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

export default withAuthorization(Models, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
