import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, PaginationState, VisibilityState } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

import {
  Button,
  Card,
  HistoricalChat,
  DataTable,
  Drawer,
  FormInput,
  FormSelect,
  Icon,
  Tooltip,
  Track,
} from 'components';
import { ConversationTeaser } from 'types/conversation';

const History: FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ConversationTeaser | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: conversations } = useQuery<ConversationTeaser[]>({
    queryKey: ['conversations'],
  });
  const columnHelper = createColumnHelper<ConversationTeaser>();

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
        <Button appearance='text' onClick={() => setSelectedConversation(props.row.original)}>
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
          pagination={pagination}
          setPagination={setPagination}
        />
      </Card>

      {selectedConversation && (
        <Drawer title={selectedConversation.name} onClose={() => setSelectedConversation(null)}>
          <HistoricalChat conversationId={selectedConversation.id} />
        </Drawer>
      )}
    </>
  );
};

export default History;
