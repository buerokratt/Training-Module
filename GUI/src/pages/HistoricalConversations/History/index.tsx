import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  Card,
  DataTable,
  Drawer,
  FormDatepicker,
  FormInput,
  FormMultiselect,
  HistoricalChat,
  Track,
} from 'components';
import { Chat as ChatType } from 'types/chat';
import { Message } from 'types/message';
import { Controller, useForm } from 'react-hook-form';
import apiDev from '../../../services/api-dev';
import { useLocation } from 'react-router-dom';
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '../../../utils/local-storage-utils';
import { CHAT_HISTORY_PREFERENCES_KEY } from 'constants/config';
import { useToast } from '../../../hooks/useToast';
import { getColumns } from './columns';
import withAuthorization, { ROLES } from 'hoc/with-authorization';

const History: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
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

  const copyValueToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);

    toast.open({
      type: 'success',
      title: t('global.notification'),
      message: t('toast.succes.copied'),
    });
  };
  const routerLocation = useLocation();
  let passedChatId = new URLSearchParams(routerLocation.search).get('chat');

  const [messagesTrigger,] = useState(false);
  const [chatMessagesList,] = useState<Message[]>([]);
  const [filteredEndedChatsList, setFilteredEndedChatsList] = useState<ChatType[]>([]);

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
      return apiDev.post('agents/chats/ended', {
        startDate: data.startDate,
        endDate: data.endDate,
      });
    },
    onSuccess: (res: any) => {
      filterChatsList(res.data.response ?? []);
    },
  });

  const getChatById = useMutation({
    mutationFn: () => {
      return apiDev.post('chat/chat-by-id', {
        chatId: passedChatId,
      });
    },
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

  const endedChatsColumns = useMemo(() => getColumns({ copyValueToClipboard, setSelectedChat}), []);

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
            name="searchChats"
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
                const columns = selection?.value ? [selection.value] : [];
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
          title={
            selectedChat.endUserFirstName !== '' &&
            selectedChat.endUserLastName !== ''
              ? `${selectedChat.endUserFirstName} ${selectedChat.endUserLastName}`
              : t('global.anonymous')
          }
          onClose={() => setSelectedChat(null)}
        >
          <HistoricalChat chat={selectedChat} trigger={messagesTrigger} />
        </Drawer>
      )}
    </>
  );
};

export default withAuthorization(History, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
