import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { MdDeleteOutline, MdOutlineModeEditOutline, MdOutlineSave } from 'react-icons/md';

import { Button, DataTable, Dialog, FormInput, Icon, Tooltip, Track } from 'components';
import { Entity } from 'types/entity';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { useToast } from 'hooks/useToast';
import { addEntity, deleteEntity, editEntity, getEntities } from 'services/entities';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import i18n from '../../../../i18n';
import { useDebouncedCallback } from 'use-debounce';
import { useInfinitePagination } from 'hooks/useInfinitePagination';
import { flattenPaginatedData } from 'utils/api-utils';

const Entities: FC = () => {
  let newEntityName = '';
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const debouncedSetFilter = useDebouncedCallback(setFilter, 300);
  const [editableRow, setEditableRow] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deletableRow, setDeletableRow] = useState<string | number | null>(null);
  const [newEntityFormOpen, setNewEntityFormOpen] = useState(false);

  const { data, refetch, fetchNextPage, isFetching } = useInfinitePagination<Entity>({
    queryKey: ['entities', filter],
    fetchFn: getEntities,
    filter,
  });
  const flatData = useMemo(() => flattenPaginatedData(data), [data]);

  const { register, handleSubmit } = useForm<{ entity: string }>();

  useDocumentEscapeListener(() => setEditableRow(null));

  const handleEditableRow = (example: { id: number; name: string }) => {
    setEditableRow(example);
  };

  const entityAddMutation = useMutation({
    mutationFn: (data: { entity: string }) => addEntity(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['entities']);
      refetch();
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.newEntityAdded'),
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setNewEntityFormOpen(false),
  });

  const entityEditMutation = useMutation({
    mutationFn: ({ data }: { data: { entity_name: string; entity: string; intent: string } }) => editEntity(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['entities']);
      refetch();
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.entityChangesSaved'),
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setEditableRow(null),
  });

  const entityDeleteMutation = useMutation({
    mutationFn: (entityData: { entity_name: string | number }) => deleteEntity(entityData),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['entities']);
      refetch();
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.entityDeleted'),
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setDeletableRow(null),
  });

  const updateEntityName = (newName: string) => {
    newEntityName = newName;
  };

  const entitiesColumns = useMemo(
    () =>
      getColumns(editableRow, updateEntityName, handleEditableRow, setDeletableRow, (name) =>
        entityEditMutation.mutate({
          data: {
            entity_name: name,
            entity: newEntityName,
            intent: 'regex',
          },
        })
      ),
    [editableRow]
  );

  const handleNewEntitySubmit = handleSubmit((data) => {
    entityAddMutation.mutate(data);
  });

  return (
    <>
      <div className="vertical-tabs__content-header">
        <Track gap={8} direction="vertical" align="stretch">
          <Track gap={16}>
            <FormInput
              label={t('global.search')}
              name="searchEntities"
              placeholder={t('global.search') + '...'}
              hideLabel
              onChange={(e) => debouncedSetFilter(e.target.value)}
            />
            <Button onClick={() => setNewEntityFormOpen(true)}>{t('global.add')}</Button>
          </Track>
          {newEntityFormOpen && (
            <Track gap={16}>
              <FormInput
                {...register('entity')}
                label={t('training.intent.entityName')}
                placeholder={t('training.intents.entityName') || ''}
                hideLabel
              />
              <Track gap={16}>
                <Button appearance="secondary" onClick={() => setNewEntityFormOpen(false)}>
                  {t('global.cancel')}
                </Button>
                <Button onClick={handleNewEntitySubmit}>{t('global.save')}</Button>
              </Track>
            </Track>
          )}
        </Track>
      </div>
      <div className="vertical-tabs__content">
        {data && (
          <DataTable data={flatData} columns={entitiesColumns} isFetching={isFetching} fetchNextPage={fetchNextPage} />
        )}
      </div>

      {deletableRow !== null && (
        <Dialog
          title={t('training.intents.deleteEntity')}
          onClose={() => setDeletableRow(null)}
          footer={
            <>
              <Button appearance="secondary" onClick={() => setDeletableRow(null)}>
                {t('global.no')}
              </Button>
              <Button appearance="error" onClick={() => entityDeleteMutation.mutate({ entity_name: deletableRow })}>
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

const getColumns = (
  editableRow: { id: number; name: string } | null,
  updateEntityName: (newName: string) => void,
  handleEditableRow: (entity: Entity) => void,
  setDeletableRow: (id: number) => void,
  onSaveClick: (name: string) => void
) => {
  const columnHelper = createColumnHelper<Entity>();

  const buildEntity = (entity: Entity, value: string) => {
    if (editableRow?.id === entity.id) {
      return (
        <FormInput
          name={`entity-${entity.id}`}
          label={i18n.t('training.intents.entity')}
          defaultValue={editableRow.name}
          onChange={(e) => updateEntityName(e.target.value)}
          hideLabel
        />
      );
    }
    if (entity.relatedIntents) {
      return (
        <Tooltip
          content={
            <Track direction="vertical" align="left">
              <strong>{i18n.t('training.intents.title')}</strong>
              {entity.relatedIntents.map((intent) => (
                <Link
                  key={intent}
                  style={{ color: '#005AA3' }}
                  to={
                    intent.startsWith('common')
                      ? `/training/common-intents?intent=${intent}#tabs`
                      : `/treening/treening/teemad?intent=${intent}#tabs`
                  }
                >
                  {intent}
                </Link>
              ))}
            </Track>
          }
        >
          <span style={{ color: '#005AA3' }}>{value}</span>
        </Tooltip>
      );
    }

    return <>{value}</>;
  };

  return [
    columnHelper.accessor('name', {
      header: i18n.t('training.intents.entities') || '',
      cell: (props) => buildEntity(props.row.original, props.getValue()),
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <>
          {editableRow && editableRow.id === props.row.original.id ? (
            <Button appearance="text" onClick={() => onSaveClick(props.row.original.name)}>
              <Icon label={i18n.t('global.save')} icon={<MdOutlineSave color={'rgba(0,0,0,0.54)'} />} />
              {i18n.t('global.save')}
            </Button>
          ) : (
            <Button appearance="text" onClick={() => handleEditableRow(props.row.original)}>
              <Icon label={i18n.t('global.edit')} icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />} />
              {i18n.t('global.edit')}
            </Button>
          )}
        </>
      ),
      id: 'edit',
      meta: {
        size: '1%',
      },
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button appearance="text" onClick={() => setDeletableRow(props.row.original.id)}>
          <Icon label={i18n.t('global.delete')} icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />} />
          {i18n.t('global.delete')}
        </Button>
      ),
      id: 'delete',
      meta: {
        size: '1%',
      },
    }),
  ];
};

export default Entities;
