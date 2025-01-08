import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';

import { Button, DataTable, Dialog, FormInput, FormSelect, Icon, Track } from 'components';
import { useToast } from 'hooks/useToast';
import { addRegex, deleteRegex, getRegexes } from 'services/regex';
import { Entity } from 'types/entity';
import i18n from '../../../../i18n';
import { getEntities } from 'services/entities';
import { useInfinitePagination } from 'hooks/useInfinitePagination';
import { flattenPaginatedData } from 'utils/api-utils';
import { RegexTeaser } from 'types/regex';
import { useDebouncedFilter } from 'hooks/useDebouncedFilter';

const Regex: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { filter, setFilter } = useDebouncedFilter();
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [deletableRow, setDeletableRow] = useState<string | number | null>(null);
  const [selectedRegex, setSelectedRegex] = useState<string | undefined>(undefined);
  const { data, refetch, fetchNextPage, isFetching } = useInfinitePagination<RegexTeaser>({
    queryKey: ['regexes', filter],
    fetchFn: getRegexes,
    filter,
  });
  const regexList = useMemo(() => flattenPaginatedData(data), [data]);
  const { data: entities } = useInfinitePagination<Entity>({
    queryKey: ['entities', ''],
    fetchFn: getEntities,
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
        message: t('toast.newRegexAdded'),
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

  const availableEntities = useMemo(
    () =>
      flattenPaginatedData(entities)
        .filter((e) => {
          return !regexList?.some((r) => r.name === e.name);
        })
        .map((e) => ({ label: e.name, value: e.id })),
    [entities, regexList]
  );

  const regexDeleteMutation = useMutation({
    mutationFn: (deleteData: { regex_name: string | number }) => deleteRegex(deleteData),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['regexes']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.regexDeleted'),
      });
      setTimeout(() => refetch(), 800);
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

  const regexColumns = useMemo(() => getColumns(navigate, setDeletableRow), []);

  const handleNewRegexSubmit = handleSubmit((data) => {
    if (selectedRegex) {
      newRegexMutation.mutate({ name: selectedRegex });
    }
  });

  return (
    <>
      <div className="vertical-tabs__content-header">
        <Track gap={8} direction="vertical" align="stretch">
          <Track gap={16}>
            <FormInput
              label={t('global.search')}
              name="searchRegex"
              placeholder={t('global.search') + '...'}
              hideLabel
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button onClick={() => setAddFormVisible(true)}>{t('global.add')}</Button>
          </Track>
          {addFormVisible && (
            <Track gap={16}>
              <div style={{ flex: 1 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      {...field}
                      label={t('training.intents.entity')}
                      hideLabel
                      onSelectionChange={(selection) => {
                        setSelectedRegex(selection?.value);
                      }}
                      options={availableEntities || []}
                    />
                  )}
                />
              </div>
              <Track gap={16}>
                <Button appearance="secondary" onClick={() => setAddFormVisible(false)}>
                  {t('global.cancel')}
                </Button>
                <Button disabled={selectedRegex === undefined} onClick={handleNewRegexSubmit}>
                  {t('global.save')}
                </Button>
              </Track>
            </Track>
          )}
        </Track>
      </div>
      <div className="vertical-tabs__content">
        {regexList && (
          <DataTable data={regexList} columns={regexColumns} isFetching={isFetching} fetchNextPage={fetchNextPage} />
        )}
      </div>

      {deletableRow !== null && (
        <Dialog
          title={t('training.intents.deleteRegex')}
          onClose={() => setDeletableRow(null)}
          footer={
            <>
              <Button appearance="secondary" onClick={() => setDeletableRow(null)}>
                {t('global.no')}
              </Button>
              <Button appearance="error" onClick={() => regexDeleteMutation.mutate({ regex_name: deletableRow })}>
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

const getColumns = (navigate: NavigateFunction, setDeletableRow: (id: string) => void) => {
  const columnHelper = createColumnHelper<RegexTeaser>();

  return [
    columnHelper.accessor('name', {
      header: i18n.t('training.intents.entities') || '',
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button appearance="text" onClick={() => navigate(`/training/regex/${props.row.original.id}`)}>
          <Icon label={i18n.t('global.edit')} icon={<MdOutlineEdit color={'rgba(0,0,0,0.54)'} />} />
          {i18n.t('global.edit')}
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

export default Regex;
