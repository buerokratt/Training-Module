import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, Card, DataTable, Dialog, FormInput, Track } from 'components';
import { useToast } from 'hooks/useToast';
import { deleteForm, getForms } from 'services/forms';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import { useInfinitePagination } from 'hooks/useInfinitePagination';
import { flattenPaginatedData } from 'utils/api-utils';
import { useDebouncedFilter } from 'hooks/useDebouncedFilter';
import { useGetColumns } from 'hooks/useGetColumns';

const Forms: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { filter, setFilter } = useDebouncedFilter();
  const [deletableForm, setDeletableForm] = useState<string | number | null>(null);

  const { data, refetch, fetchNextPage, isFetching } = useInfinitePagination<string>({
    queryKey: ['forms', filter],
    fetchFn: getForms,
    filter,
  });

  const forms = useMemo(() => flattenPaginatedData(data), [data]);

  const deleteFormMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteForm(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['forms']);
      refetch();
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.formDeleted'),
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: getErrorMessage(error),
      });
    },
    onSettled: () => setDeletableForm(null),
  });

  const getErrorMessage = (error: AxiosError) => {
    if (error.response && error.response.status === 409 && error.response) {
      return t(`${error.response}`);
    }
    return error.message;
  };

  const formsColumns = useGetColumns('forms', setDeletableForm);

  if (!forms) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.forms.title')}</h1>

      <Card
        header={
          <Track gap={16}>
            <FormInput
              label={t('global.search')}
              name="search"
              placeholder={t('global.search') + '...'}
              hideLabel
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button onClick={() => navigate('/training/forms/new')}>{t('global.add')}</Button>
          </Track>
        }
      >
        <DataTable data={forms} columns={formsColumns} isFetching={isFetching} fetchNextPage={fetchNextPage} sortable />
      </Card>

      {deletableForm !== null && (
        <Dialog
          title={t('training.forms.deleteForm')}
          onClose={() => setDeletableForm(null)}
          footer={
            <>
              <Button appearance="secondary" onClick={() => setDeletableForm(null)}>
                {t('global.no')}
              </Button>
              <Button appearance="error" onClick={() => deleteFormMutation.mutate({ id: deletableForm })}>
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

export default withAuthorization(Forms, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
