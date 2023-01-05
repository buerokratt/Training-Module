import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { MdDeleteOutline } from 'react-icons/md';

import { Button, Card, DataTable, FormInput, FormSelect, Icon } from 'components';
import { Appeal } from 'types/appeal';
import { Intent } from 'types/intent';

const Appeals: FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const { data: appeals } = useQuery<Appeal[]>({
    queryKey: ['appeals'],
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });
  const columnHelper = createColumnHelper<Appeal>();

  const appealsColumns = useMemo(() => [
    columnHelper.accessor('appeal', {
      header: 'Intent',
    }),
    columnHelper.accessor('intent', {
      header: 'Response',
      cell: (props) => (
        <FormSelect
          label='select'
          hideLabel
          name='name'
          defaultValue={props.getValue()}
          options={intents?.map((intent) => ({
            label: intent.intent,
            value: String(intent.id),
          })) || []}
        />
      ),
    }),
    columnHelper.display({
      header: '',
      cell: (props) => (
        <Button appearance='text'>
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
  ], [columnHelper, intents, t]);

  if (!appeals) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.historicalConversations.appeals')}</h1>

      <Card>
        <FormInput
          label={t('global.search')}
          hideLabel
          name='searchIntent'
          placeholder={t('training.historicalConversations.searchIntent') + '...'}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Card>

      <Card>
        <DataTable
          data={appeals}
          columns={appealsColumns}
          globalFilter={filter}
          setGlobalFilter={setFilter}
        />
      </Card>
    </>
  );
};

export default Appeals;
