import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, VisibilityState } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

import { Button, Card, DataTable, FormInput, FormSelect, Icon, Tooltip, Track } from 'components';
import { Conversation } from 'types/conversation';

const History: FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
  });
  const columnHelper = createColumnHelper<Conversation>();

  const conversationColumns = useMemo(() => [
    columnHelper.accessor('startTime', {
      header: t('training.historicalConversations.startTime') || '',
      cell: (props) => format(new Date(props.getValue()), 'd. MMM yyyy HH:ii:ss'),
    }),
    columnHelper.accessor('endTime', {
      header: t('training.historicalConversations.endTime') || '',
      cell: (props) => format(new Date(props.getValue()), 'd. MMM yyyy HH:ii:ss'),
    }),
    columnHelper.accessor('name', {
      header: t('training.historicalConversations.name') || '',
    }),
    columnHelper.accessor('label', {
      header: t('training.historicalConversations.label') || '',
    }),
    columnHelper.accessor('comment', {
      header: t('training.historicalConversations.comment') || '',
      cell: (props) => {
        const comment = props.getValue();

        if (comment && comment.length > 30) {
          return (
            <Tooltip content={props.getValue()}>
              <span>{props.getValue()?.slice(0, 30) + '...'}</span>
            </Tooltip>
          );
        }
        return props.getValue();
      },
    }),
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.display({
      id: 'detail',
      cell: (props) => (
        <Button appearance='text'>
          <Icon icon={<MdOutlineRemoveRedEye color={'rgba(0,0,0,0.54)'} />} />
          {t('global.view')}
        </Button>
      ),
      meta: {
        size: '1%',
      },
    }),
  ], [columnHelper, t]);

  if (!conversations) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.historicalConversations.title')}</h1>

      <Card>
        <Track gap={16}>
          <FormInput
            label={t('training.historicalConversations.search') + '...'}
            name='search'
            placeholder={t('training.historicalConversations.search') + '...'}
            hideLabel
            onChange={(e) => setFilter(e.target.value)}
          />
        </Track>
      </Card>

      <Card>
        <DataTable
          data={conversations}
          columns={conversationColumns}
          sortable
          globalFilter={filter}
          setGlobalFilter={setFilter}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          pagination={{
            pageIndex: 0,
            pageSize: 10,
          }}
        />
      </Card>
    </>
  );
};

export default History;
