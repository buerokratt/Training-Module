import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { MdDeleteOutline, MdOutlineModeEditOutline, MdOutlineSave } from 'react-icons/md';

import { Button, DataTable, Dialog, FormInput, Icon, Tooltip, Track } from 'components';
import { Entity } from 'types/entity';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { useToast } from 'hooks/useToast';
import { addEntity, deleteEntity, editEntity } from 'services/entities';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Entities: FC = () => {
  let newEntityName = '';
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [editableRow, setEditableRow] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deletableRow, setDeletableRow] = useState<string | number | null>(null);
  const [newEntityFormOpen, setNewEntityFormOpen] = useState(false);
  const { data: entities, refetch } = useQuery<Entity[]>({
    queryKey: ['entities']
  });
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
        message: 'New entity added',
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
    mutationFn: ({ data }: { data: { entity_name: string, entity: string, intent: string } }) => editEntity(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['entities']);
      refetch();
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Entity changes saved',
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
        message: 'Entity deleted',
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

  const columnHelper = createColumnHelper<Entity>();

  const updateEntityName = (newName: string) => {
    newEntityName = newName;
  }

  const entitiesColumns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('training.intents.entities') || '',
      cell: (props) => editableRow && editableRow.id === props.row.original.id ? (
        <FormInput
          name={`entity-${props.row.original.id}`}
          label={t('training.intents.entity')}
          defaultValue={editableRow.name}
          onChange={(e) => updateEntityName(e.target.value)}
          hideLabel
        />
      ) : props.row.original.relatedIntents ? (
        <Tooltip content={
          <Track direction='vertical' align='left'>
            <strong>{t('training.intents.title')}</strong>
            {props.row.original.relatedIntents.map((intent) => (
              <Link
                key={intent}
                style={{ color: '#005AA3' }}
                to={intent.startsWith('common')
                  ? `/training/common-intents?intent=${intent}#tabs`
                  : `/treening/treening/teemad?intent=${intent}#tabs`
                }
              >
                {intent}
              </Link>
            ))}
          </Track>
        }>
          <span style={{ color: '#005AA3' }}>{props.getValue()}</span>
        </Tooltip>
      ) : props.getValue(),
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <>
          {editableRow && editableRow.id === props.row.original.id ? (
            <Button appearance='text' onClick={() => entityEditMutation.mutate({
              data: {
                entity_name: props.row.original.name,
                entity: newEntityName,
                intent: 'regex'
              },
            })}>
              <Icon
                label={t('global.save')}
                icon={<MdOutlineSave color={'rgba(0,0,0,0.54)'} />}
              />
              {t('global.save')}
            </Button>
          ) : (
            <Button
              appearance='text'
              onClick={() => handleEditableRow(props.row.original)}
            >
              <Icon
                label={t('global.edit')}
                icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />}
              />
              {t('global.edit')}
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
        <Button appearance='text' onClick={() => setDeletableRow(props.row.original.id)}>
          <Icon
            label={t('global.delete')}
            icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />}
          />
          {t('global.delete')}
        </Button>
      ),
      id: 'delete',
      meta: {
        size: '1%',
      },
    }),
  ], [columnHelper, editableRow, entityEditMutation, t]);

  const handleNewEntitySubmit = handleSubmit((data) => {
    entityAddMutation.mutate(data);
  });

  return (
    <>
      <div className='vertical-tabs__content-header'>
        <Track gap={8} direction='vertical' align='stretch'>
          <Track gap={16}>
            <FormInput
              label={t('global.search')}
              name='searchEntities'
              placeholder={t('global.search') + '...'}
              hideLabel
              onChange={(e) => setFilter(e.target.value)}
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
                <Button appearance='secondary' onClick={() => setNewEntityFormOpen(false)}>{t('global.cancel')}</Button>
                <Button onClick={handleNewEntitySubmit}>{t('global.save')}</Button>
              </Track>
            </Track>
          )}
        </Track>
      </div>
      <div className='vertical-tabs__content'>
        {entities && (
          <DataTable
            data={entities}
            columns={entitiesColumns}
            globalFilter={filter}
            setGlobalFilter={setFilter}
          />
        )}
      </div>

      {deletableRow !== null && (
        <Dialog
          title={t('training.intents.deleteEntity')}
          onClose={() => setDeletableRow(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableRow(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => entityDeleteMutation.mutate({ entity_name: deletableRow })}
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

export default Entities;
