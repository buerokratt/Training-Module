import React, {FC, useEffect, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {useMutation, useQuery} from '@tanstack/react-query';
import { createColumnHelper, PaginationState } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

import {
  Button,
  Card,
  DataTable,
  Drawer,
  FormDatepicker,
  FormInput, FormMultiselect,
  HistoricalChat,
  Icon,
  Tooltip,
  Track
} from 'components';
import { Chat as ChatType, CHAT_STATUS } from 'types/chat';
import { Message } from 'types/message';
import {Controller, useForm} from "react-hook-form";
import apiDev from "../../../services/api-dev";
import {useLocation} from "react-router-dom";
import {getFromLocalStorage, setToLocalStorage} from "../../../utils/local-storage-utils";
import { CHAT_HISTORY_PREFERENCES_KEY } from 'constants/config';
import apigeneric from "../../../services/apigeneric";

const History: FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const preferences = getFromLocalStorage(
      CHAT_HISTORY_PREFERENCES_KEY
  ) as string[];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
      preferences ?? []
  );

  const columnHelper = createColumnHelper<ChatType>();
  const routerLocation = useLocation();
  let passedChatId = new URLSearchParams(routerLocation.search).get('chat');

  const [endedChatsList, setEndedChatsList] = useState<ChatType[]>([]);
  const [chatMessagesList, setchatMessagesList] = useState<Message[]>([]);
  const [filteredEndedChatsList, setFilteredEndedChatsList] = useState<
      ChatType[]
  >([]);

  const { control, watch } = useForm<{
    startDate: Date | string;
    endDate: Date | string;
  }>({
    defaultValues: {
      startDate: new Date(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate()
      ),
      endDate: new Date(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate() + 1
      ),
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
      if (passedChatId != null) {
          getChatById.mutate();
          passedChatId = null;
      }
  }, [passedChatId]);

  useEffect(() => {
    getAllEndedChats.mutate({
      startDate: format(new Date(startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(endDate), 'yyyy-MM-dd'),
    });
  }, []);

  const getAllEndedChats = useMutation({
    mutationFn: (data: { startDate: string; endDate: string }) => {
        if(import.meta.env.REACT_APP_LOCAL === 'true') {
            return apigeneric.get('csa/ended-chats');
        }
        return apiDev.post('csa/ended-chats', {
            startDate: data.startDate,
            endDate: data.endDate,
        })
    }
    ,
    onSuccess: (res: any) => {
      setEndedChatsList(res.data.response ?? []);
      filterChatsList(res.data.response ?? []);
    },
  });

  const getChatById = useMutation({
    mutationFn: () => {
        return apiDev.post('chat/chat-by-id', {
            chatId: passedChatId,
        })
    }
        ,
    onSuccess: (res: any) => {
      setSelectedChat(res.data.response);
    },
  });

  const filterChatsList = (chatsList: ChatType[]) => {
    const startDate = Date.parse(
        format(new Date(control._formValues.startDate), 'MM/dd/yyyy')
    );

    const endDate = Date.parse(
        format(new Date(control._formValues.endDate), 'MM/dd/yyyy')
    );

    setFilteredEndedChatsList(
        chatsList.filter((c) => {
          const created = Date.parse(format(new Date(c.created), 'MM/dd/yyyy'));
          return created >= startDate && created <= endDate;
        })
    );
  };

  const endedChatsColumns = useMemo(() => [
    columnHelper.accessor('created', {
      header: t('chat.history.startTime') || '',
      cell: (props) => format(new Date(props.getValue()), 'd. MMM yyyy HH:ii:ss'),
    }),
    columnHelper.accessor('ended', {
      header: t('chat.history.endTime') || '',
      cell: (props) => format(new Date(props.getValue()), 'd. MMM yyyy HH:ii:ss'),
    }),
    columnHelper.accessor('customerSupportDisplayName', {
      header: t('chat.history.csaName') || '',
    }),
    columnHelper.accessor((row) => `${row.endUserFirstName} ${row.endUserLastName}`, {
      header: t('global.name') || '',
    }),
    columnHelper.accessor('endUserId', {
      header: t('global.idCode') || '',
    }),
    columnHelper.accessor('contactsMessage', {
      header: t('chat.history.contact') || '',
      cell: (props) => props.getValue()
        ? t('global.yes')
        : t('global.no'),
    }),
    columnHelper.accessor('comment', {
      header: t('chat.history.comment') || '',
      cell: (props) => (
        <Tooltip content={props.getValue()}>
          <span>{props.getValue()?.slice(0, 30) + '...'}</span>
        </Tooltip>
      ),
    }),
    columnHelper.accessor('labels', {
      header: t('chat.history.label') || '',
      cell: (props) => <span></span>,
    }),
    // columnHelper.accessor('nps', {
    //   header: 'NPS',
    // }),
    columnHelper.accessor('status', {
      id: 'status',
      header: t('global.status') || '',
      cell: (props) =>
          props.getValue() === CHAT_STATUS.ENDED
              ? props.row.original.lastMessageEvent != null &&
              props.row.original.lastMessageEvent !== 'message-read'
                  ? t(
                      'chat.plainEvents.' + props.row.original.lastMessageEvent ??
                      ''
                  )
                  : t('chat.status.ended')
              : '',
      sortingFn: (a, b, isAsc) => {
        const statusA =
            a.getValue('status') === CHAT_STATUS.ENDED
                ? t('chat.plainEvents.' + (a.original.lastMessageEvent ?? ''))
                : '';
        const statusB =
            b.getValue('status') === CHAT_STATUS.ENDED
                ? t('chat.plainEvents.' + (b.original.lastMessageEvent ?? ''))
                : '';
        return (
            statusA.localeCompare(statusB, undefined, {
              numeric: true,
              sensitivity: 'base',
            }) * (isAsc ? 1 : -1)
        );
      },
    }),
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.display({
      id: 'detail',
      cell: (props) => (
        <Button appearance='text' onClick={() => setSelectedChat(props.row.original)}>
          <Icon icon={<MdOutlineRemoveRedEye color={'rgba(0,0,0,0.54)'} />} />
          {t('global.view')}
        </Button>
      ),
      meta: {
        size: '1%',
      },
    }),
  ], [columnHelper, t]);
  const visibleColumnOptions = useMemo(
      () => [
        { label: t('chat.history.startTime'), value: 'created' },
        { label: t('chat.history.endTime'), value: 'ended' },
        { label: t('chat.history.csaName'), value: 'customerSupportDisplayName' },
        { label: t('global.name'), value: 'endUserName' },
        { label: t('global.idCode'), value: 'endUserId' },
        { label: t('chat.history.contact'), value: 'contactsMessage' },
        { label: t('chat.history.comment'), value: 'comment' },
        { label: t('chat.history.label'), value: 'labels' },
        // { label: t('chat.history.nps'), value: 'nps' },
        { label: t('global.status'), value: 'status' },
        { label: 'ID', value: 'id' },
      ],
      [t]
  );

  if (!filteredEndedChatsList) return <>Loading...</>;

  return (
    <>
      <h1>{t('chat.history.title')}</h1>

      <Card>
        <Track gap={16}>
        <FormInput
          label={t('chat.history.searchChats')}
          hideLabel
          name='searchChats'
          placeholder={t('chat.history.searchChats') + '...'}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Track style={{ width: '100%' }} gap={16}>
          <Track gap={10}>
            <p>{t('global.from')}</p>
            <Controller
                name="startDate"
                control={control}
                render={({ field }) => {
                  return (
                      <FormDatepicker
                          {...field}
                          label={''}
                          value={field.value ?? new Date()}
                          onChange={(v) => {
                            field.onChange(v);
                            getAllEndedChats.mutate({
                              startDate: format(new Date(v), 'yyyy-MM-dd'),
                              endDate: format(new Date(endDate), 'yyyy-MM-dd'),
                            });
                          }}
                      />
                  );
                }}
            />
          </Track>
          <Track gap={10}>
            <p>{t('global.to')}</p>
            <Controller
                name="endDate"
                control={control}
                render={({ field }) => {
                  return (
                      <FormDatepicker
                          {...field}
                          label={''}
                          value={field.value ?? new Date()}
                          onChange={(v) => {
                            field.onChange(v);
                            getAllEndedChats.mutate({
                              startDate: format(new Date(startDate), 'yyyy-MM-dd'),
                              endDate: format(new Date(v), 'yyyy-MM-dd'),
                            });
                          }}
                      />
                  );
                }}
            />
          </Track>
          <FormMultiselect
              name="visibleColumns"
              label={t('')}
              options={visibleColumnOptions}
              selectedOptions={visibleColumnOptions.filter((o) =>
                  selectedColumns.includes(o.value)
              )}
              onSelectionChange={(selection) => {
                const columns = selection?.map((s) => s.value) ?? [];
                setSelectedColumns(columns);
                setToLocalStorage(CHAT_HISTORY_PREFERENCES_KEY, columns);
              }}
          />
        </Track>
        </Track>
      </Card>

      <Card>
        <DataTable
          data={filteredEndedChatsList}
          sortable
          columns={endedChatsColumns}
          globalFilter={filter}
          setGlobalFilter={setFilter}
          pagination={pagination}
          setPagination={setPagination}
        />
      </Card>

      {selectedChat && chatMessagesList && (
        <Drawer
          title={selectedChat.endUserFirstName !== '' && selectedChat.endUserLastName !== ''
            ? `${selectedChat.endUserFirstName} ${selectedChat.endUserLastName}`
            : t('global.anonymous')}
          onClose={() => setSelectedChat(null)}
        >
          <HistoricalChat chat={selectedChat} />
        </Drawer>
      )}
    </>
  );
};

export default History;
