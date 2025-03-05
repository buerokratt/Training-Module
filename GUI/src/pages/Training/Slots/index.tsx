import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';

import { Button, Card, DataTable, Dialog, FormInput, Icon, Track } from 'components';
import { useToast } from 'hooks/useToast';
import { deleteSlot, getSlots } from 'services/slots';
import i18n from '../../../../i18n';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import { useDebouncedFilter } from 'hooks/useDebouncedFilter';
import { useInfinitePagination } from 'hooks/useInfinitePagination';
import { flattenPaginatedData } from 'utils/api-utils';
import { useGetColumns } from 'hooks/useGetColumns';

const Slots: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { filter, setFilter } = useDebouncedFilter();
  const [deletableSlot, setDeletableSlot] = useState<string | number | null>(null);

  const { data, refetch, fetchNextPage, isFetching } = useInfinitePagination<string>({
    queryKey: ['slots', filter],
    fetchFn: getSlots,
    filter,
  });
  const slots = useMemo(() => flattenPaginatedData(data), [data]);

  const deleteSlotMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteSlot(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['slots']);
      refetch();
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.slotDeleted'),
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setDeletableSlot(null),
  });

  const slotsColumns = useGetColumns(navigate, setDeletableSlot);
  // const slotsColumns = useMemo(() => cols, []);
  // const slotsColumns = useMemo(() => getColumns(navigate, setDeletableSlot), []);

  if (!slots) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.slots.title')}</h1>

      <Card
        header={
          <Track gap={16}>
            <FormInput
              label="search"
              name="search"
              placeholder={t('global.search') + '...'}
              hideLabel
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button onClick={() => navigate('/training/slots/new')}>{t('global.add')}</Button>
          </Track>
        }
      >
        <DataTable data={slots} columns={slotsColumns} isFetching={isFetching} fetchNextPage={fetchNextPage} sortable />
      </Card>

      {deletableSlot !== null && (
        <Dialog
          title={t('training.slots.deleteSlot')}
          onClose={() => setDeletableSlot(null)}
          footer={
            <>
              <Button appearance="secondary" onClick={() => setDeletableSlot(null)}>
                {t('global.no')}
              </Button>
              <Button appearance="error" onClick={() => deleteSlotMutation.mutate({ id: deletableSlot })}>
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

const getColumns = (navigate: NavigateFunction, setDeletableSlot: (id: string) => void) => {
  const columnHelper = createColumnHelper<string>();
  console.log('render COLUMNS FUNCTION');

  return [
    columnHelper.accessor((row) => row, {
      header: i18n.t('training.slots.titleOne') || '',
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button appearance="text" onClick={() => navigate(`/training/slots/${props.row.original}`)}>
          <Icon label={i18n.t('global.edit')} icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />} />
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
        <Button appearance="text" onClick={() => setDeletableSlot(props.row.original)}>
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

export default withAuthorization(Slots, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
