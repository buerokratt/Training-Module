import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';

import { Button, Card, DataTable, Dialog, FormInput, Icon, Track } from 'components';
import { Form } from 'types/form';
import { useToast } from 'hooks/useToast';
import { deleteForm } from 'services/forms';

const Forms: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [deletableForm, setDeletableForm] = useState<string | number | null>(null);
  const { data: forms } = useQuery<Form[]>({
    queryKey: ['forms'],
  });

  const deleteFormMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteForm(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['forms']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Form deleted',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.response?.data || error.message,
      });
    },
    onSettled: () => setDeletableForm(null),
  });

  const columnHelper = createColumnHelper<Form>();

  const formsColumns = useMemo(() => [
    columnHelper.accessor('form', {
      header: t('training.forms.titleOne') || '',
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button
          appearance='text'
          onClick={() => navigate(`/training/forms/${props.row.original.id}`)}
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
        <Button appearance='text' onClick={() => setDeletableForm(props.row.original.id)}>
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

  if (!forms) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.forms.title')}</h1>

      <Card header={
        <Track gap={16}>
          <FormInput
            label={t('global.search')}
            name='search'
            placeholder={t('global.search') + '...'}
            hideLabel
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={() => navigate('/training/forms/new')}>{t('global.add')}</Button>
        </Track>
      }>
        <DataTable data={forms} columns={formsColumns} globalFilter={filter} setGlobalFilter={setFilter} sortable />
      </Card>

      {deletableForm !== null && (
        <Dialog
          title={t('training.forms.deleteForm')}
          onClose={() => setDeletableForm(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableForm(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => deleteFormMutation.mutate({ id: deletableForm })}
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

export default Forms;
