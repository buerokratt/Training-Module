import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';

import { Button, Card, DataTable, Dialog, FormInput, Icon, Track } from 'components';
import { Slot } from 'types/slot';
import { useToast } from 'hooks/useToast';
import { deleteSlot } from 'services/slots';

const Slots: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [deletableSlot, setDeletableSlot] = useState<string | number | null>(null);
  const { data: slots } = useQuery<Slot[]>({
    queryKey: ['slots'],
  });

  const deleteSlotMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteSlot(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['slots']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Slot deleted',
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

  const columnHelper = createColumnHelper<Slot>();

  const slotsColumns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('training.slots.titleOne') || '',
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button
          appearance='text'
          onClick={() => navigate(`/treening/treening/pilud/${props.row.original.id}`)}
        >
          <Icon
            label={t('global.edit')}
            icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />}
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
        <Button appearance='text' onClick={() => setDeletableSlot(props.row.original.id)}>
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

  if (!slots) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.slots.title')}</h1>

      <Card header={
        <Track gap={16}>
          <FormInput
            label='search'
            name='search'
            placeholder={t('global.search') + '...'}
            hideLabel
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={() => navigate('/treening/treening/pilud/uus')}>{t('global.add')}</Button>
        </Track>
      }>
        <DataTable data={slots} columns={slotsColumns} globalFilter={filter} setGlobalFilter={setFilter} sortable />
      </Card>

      {deletableSlot !== null && (
        <Dialog
          title={t('training.responses.deleteResponse')}
          onClose={() => setDeletableSlot(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableSlot(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => deleteSlotMutation.mutate({ id: deletableSlot })}
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

export default Slots;
