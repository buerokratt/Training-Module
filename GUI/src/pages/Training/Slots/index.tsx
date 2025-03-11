import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { Button, Card, DataTable, Dialog, FormInput, Track } from 'components';
import { useToast } from 'hooks/useToast';
import { deleteSlot, getSlots } from 'services/slots';
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

  const slotsColumns = useGetColumns('slots', setDeletableSlot);

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

export default withAuthorization(Slots, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
