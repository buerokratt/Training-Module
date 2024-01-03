import {FC, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';

import { Button, DataTable, Dialog, FormInput, FormSelect, Icon, Track } from 'components';
import { useToast } from 'hooks/useToast';
import { addRegex, deleteRegex } from 'services/regex';
import { Entity } from 'types/entity';

type RegexTeaser = {
  readonly id: number;
  name: string;
}

const Regex: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [deletableRow, setDeletableRow] = useState<string | number | null>(null);
  const [selectedRegex, setSelectedRegex] = useState<string | undefined>(undefined);
  const { data: regexList, refetch } = useQuery<RegexTeaser[]>({
    queryKey: ['regexes'],
  });
  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });
  const { control, handleSubmit } = useForm<{ name: string }>();

  const newRegexMutation = useMutation({
    mutationFn: (data: { name: string }) => addRegex(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['regex']);
      refetch();
      setAddFormVisible(false);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New regex added',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setAddFormVisible(false),
  });

  const availableEntities = useMemo(() => entities?.filter((e) => {
    return !regexList?.some((r) => r.name === e.name);
  }).map((e) => ({ label: e.name, value: String(e.id) })), [entities, regexList]);

  const regexDeleteMutation = useMutation({
    mutationFn: ( deleteData : { regex_name: string | number }) => deleteRegex(deleteData),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['regexes']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Regex deleted',
      });
      setTimeout(() => refetch(), 1000);
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

  const columnHelper = createColumnHelper<RegexTeaser>();

  const regexColumns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('training.intents.entities') || '',
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button appearance='text'
                onClick={() => navigate(`/training/regex/${props.row.original.id}`)}>
          <Icon
            label={t('global.edit')}
            icon={<MdOutlineEdit color={'rgba(0,0,0,0.54)'} />}
          />
          {t('global.edit')}
        </Button>
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
  ], [columnHelper, navigate, t]);

  const handleNewRegexSubmit = handleSubmit((data) => {
    if(selectedRegex) {
      newRegexMutation.mutate({name: selectedRegex});
    }
  });

  return (
    <>
      <div className='vertical-tabs__content-header'>
        <Track gap={8} direction='vertical' align='stretch'>
          <Track gap={16}>
            <FormInput
              label={t('global.search')}
              name='searchRegex'
              placeholder={t('global.search') + '...'}
              hideLabel
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button onClick={() => setAddFormVisible(true)}>{t('global.add')}</Button>
          </Track>
          {addFormVisible && (
            <Track gap={16}>
              <div style={{ flex: 1 }}>
                <Controller name='name' control={control} render={({ field }) => (
                  <FormSelect
                    {...field}
                    label={t('training.intents.entity')}
                    hideLabel
                    onSelectionChange={(selection) => {
                      setSelectedRegex(selection?.value);
                    }}
                    options={availableEntities || []
                  }
                  />
                )} />
              </div>
              <Track gap={16}>
                <Button appearance='secondary' onClick={() => setAddFormVisible(false)}>{t('global.cancel')}</Button>
                <Button disabled={selectedRegex === undefined} onClick={handleNewRegexSubmit}>{t('global.save')}</Button>
              </Track>
            </Track>
          )}
        </Track>
      </div>
      <div className='vertical-tabs__content'>
        {regexList && (
          <DataTable
            data={regexList}
            columns={regexColumns}
            globalFilter={filter}
            setGlobalFilter={setFilter}
          />
        )}
      </div>

      {deletableRow !== null && (
        <Dialog
          title={t('training.intents.deleteRegex')}
          onClose={() => setDeletableRow(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableRow(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => regexDeleteMutation.mutate({ regex_name: deletableRow })}
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

export default Regex;
