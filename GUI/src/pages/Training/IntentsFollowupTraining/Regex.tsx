import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline } from 'react-icons/md';

import { Button, DataTable, Dialog, FormInput, Icon, Track } from 'components';
import { useToast } from 'hooks/useToast';
import { deleteEntity } from '../../../services/entities';
import { AxiosError } from 'axios';
import { deleteRegex } from '../../../services/regex';

type RegexTeaser = {
  readonly id: number;
  name: string;
}

const Regex: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [deletableRow, setDeletableRow] = useState<string | number | null>(null);
  const { data: regexList } = useQuery<RegexTeaser[]>({
    queryKey: ['regex'],
  });

  const regexDeleteMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteRegex(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['regex']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'REGEX deleted',
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

  const columnHelper = createColumnHelper<RegexTeaser>();

  const regexColumns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('training.intents.regex') || '',
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
  ], [columnHelper, t]);

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
            <Button>{t('global.add')}</Button>
          </Track>
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
                onClick={() => regexDeleteMutation.mutate({ id: deletableRow })}
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
