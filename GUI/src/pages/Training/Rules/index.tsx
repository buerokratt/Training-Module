import { FC, useEffect, useMemo, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';

import { Button, Card, DataTable, Dialog, FormInput, Icon, Track } from 'components';
import { Rule } from 'types/rule';
import { deleteRule, getRules } from '../../../services/rules';
import { AxiosError } from 'axios';
import LoadingDialog from '../../../components/LoadingDialog';
import { useToast } from 'hooks/useToast';
import i18n from '../../../../i18n';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import { useInfinitePagination } from 'hooks/useInfinitePagination';
import { flattenPaginatedData } from 'utils/api-utils';
import { useDebouncedFilter } from 'hooks/useDebouncedFilter';

const Rules: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const [filter, setFilter] = useState('');
  const { filter, setFilter } = useDebouncedFilter();

  const { data, fetchNextPage, isFetching } = useInfinitePagination<Rule>({
    queryKey: ['rules', filter],
    fetchFn: getRules,
    filter,
  });
  const flatData = useMemo(() => flattenPaginatedData(data), [data]);

  const [rules, setRules] = useState<{ id: string; rule: string }[]>([]);
  const toast = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');

  useEffect(() => {
    if (flatData) {
      setRules(
        flatData.map((r) => ({
          id: r.id,
          rule: r.id,
        }))
      );
    }
  }, [flatData]);

  const handleDelete = (id: string) => {
    setDeleteConfirmation(true);
    setDeleteId(id);
  };

  const rulesColumns = useMemo(() => getRulesColumns(handleDelete, navigate), [navigate]);

  const deleteRuleMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteRule(id),
    onMutate: () => setRefreshing(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['rules']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.ruleDeleted'),
      });
      setRules(rules.filter((rule) => rule.id !== deleteId));
      navigate(import.meta.env.BASE_URL + '/rules');
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => {
      setRefreshing(false);
    },
  });

  return (
    <>
      <h1>{t('training.rules.title')}</h1>

      <Card>
        <Track gap={16}>
          <FormInput
            label={t('global.search')}
            name="search"
            placeholder={t('global.search') + '...'}
            hideLabel
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={() => navigate('/training/rules/new', { state: { id: filter, category: 'rules' } })}>
            {t('global.add')}
          </Button>
        </Track>
      </Card>

      <Card>
        {rules && (
          <DataTable data={rules} columns={rulesColumns} isFetching={isFetching} fetchNextPage={fetchNextPage} />
        )}
      </Card>

      {deleteId && deleteConfirmation && (
        <Dialog
          title={t('training.responses.deleteRule')}
          onClose={() => setDeleteConfirmation(false)}
          footer={
            <>
              <Button appearance="secondary" onClick={() => setDeleteConfirmation(false)}>
                {t('global.no')}
              </Button>
              <Button
                appearance="error"
                onClick={() => {
                  deleteRuleMutation.mutate({ id: deleteId });
                  setDeleteConfirmation(false);
                }}
              >
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}

      {refreshing && (
        <LoadingDialog title={t('global.updatingDataHead')}>
          <p>{t('global.updatingDataBody')}</p>
        </LoadingDialog>
      )}
    </>
  );
};

const getRulesColumns = (handleDelete: (id: string) => void, navigate: NavigateFunction) => {
  const rulesColumnHelper = createColumnHelper<Rule>();
  return [
    rulesColumnHelper.accessor('id', {
      header: 'Rule',
    }),
    rulesColumnHelper.display({
      header: '',
      cell: (props) => (
        <Button
          appearance="text"
          onClick={() => navigate(`${props.row.original.id}`, { state: { category: 'rules' } })}
        >
          <Icon label={i18n.t('global.edit')} icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />} />
          {i18n.t('global.edit')}
        </Button>
      ),
      id: 'edit',
      meta: {
        size: '1%',
      },
    }),
    rulesColumnHelper.display({
      header: '',
      cell: (props) => (
        <Button appearance="text" onClick={() => handleDelete(props.row.original.id)}>
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

export default withAuthorization(Rules, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
