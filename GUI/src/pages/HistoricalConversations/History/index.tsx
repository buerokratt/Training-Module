import React, {FC, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation} from '@tanstack/react-query';
import {PaginationState, SortingState} from '@tanstack/react-table';
import {format} from 'date-fns';
import {Card, DataTable, Drawer, FormDatepicker, FormInput, FormMultiselect, HistoricalChat, Track,} from 'components';
import {Chat as ChatType} from 'types/chat';
import {Message} from 'types/message';
import {Controller, useForm} from 'react-hook-form';
import {api} from '../../../services/api';
import {useLocation, useSearchParams} from 'react-router-dom';
import {useToast} from '../../../hooks/useToast';
import {getColumns} from './columns';
import withAuthorization, {ROLES} from 'hoc/with-authorization';
import {useDebouncedCallback} from "use-debounce";
import useStore from "../../../store/store";
import "./History.scss";

const History: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const userInfo = useStore((state) => state.userInfo);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const passedCustomerSupportIds = searchParams.getAll('customerSupportIds');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: searchParams.get("page") ? parseInt(searchParams.get("page") as string) - 1 : 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [customerSupportAgents, setCustomerSupportAgents] = useState<any[]>([]);
  const [counterKey, setCounterKey] = useState<number>(0)

  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const debouncedGetAllEnded = useDebouncedCallback((search) => {
    getAllEndedChats.mutate({
      startDate: format(new Date(startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(endDate), 'yyyy-MM-dd'),
      customerSupportIds: passedCustomerSupportIds,
      pagination,
      sorting,
      search,
    });
  }, 500);

  const fetchData = async () => {
    setInitialLoad(false);
    try {
      const response = await api.get('/accounts/get-page-preference', {
        params: {user_id: userInfo?.idCode, page_name: window.location.pathname},
      });
      if (response.data.pageResults !== undefined) {
        const newSelectedColumns = response.data?.selectedColumns.length === 1 && response.data?.selectedColumns[0] === "" ? [] : response.data?.selectedColumns;
        setSelectedColumns(newSelectedColumns)
        const updatedPagination = updatePagePreference(response.data.pageResults)
        setCounterKey(counterKey + 1)
        getAllEndedChats.mutate({
          startDate: format(new Date(startDate), 'yyyy-MM-dd'),
          endDate: format(new Date(endDate), 'yyyy-MM-dd'),
          customerSupportIds: passedCustomerSupportIds,
          updatedPagination,
          sorting,
          search,
        });
      }
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    listCustomerSupportAgents.mutate();
  }, []);

  const updatePagePreference = (pageResults: number): PaginationState => {
    const updatedPagination: PaginationState = {...pagination, pageSize: pageResults};
    setPagination(updatedPagination);
    return updatedPagination;
  }

  const copyValueToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);

    toast.open({
      type: 'success',
      title: t('global.notification'),
      message: t('toast.copied'),
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
      startDate: searchParams.get('start') ? new Date(searchParams.get('start') as string) : new Date(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
      ),
      endDate: searchParams.get('end') ? new Date(searchParams.get('end') as string) :new Date(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
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
    if(initialLoad) {
      fetchData();
    } else {
      getAllEndedChats.mutate({
        startDate: format(new Date(startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(endDate), 'yyyy-MM-dd'),
        customerSupportIds: passedCustomerSupportIds,
        pagination,
        sorting,
        search,
      });
    }
  }, []);

  const getAllEndedChats = useMutation({
    mutationFn: (data: {
      startDate: string;
      endDate: string;
      customerSupportIds: string[];
      pagination: PaginationState;
      sorting: SortingState;
      search: string;
    }) => {
      let sortBy = 'created desc';
      if(sorting.length > 0) {
        const sortType = sorting[0].desc ? 'desc' : 'asc';
        sortBy = `${sorting[0].id} ${sortType}`;
      }

      return api.post('agents/chats/ended', {
        startDate: data.startDate,
        endDate: data.endDate,
        customerSupportIds: data.customerSupportIds,
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        sorting: sortBy,
        search
      });
    },
    onSuccess: (res: any) => {
      filterChatsList(res.data.response ?? []);
      setTotalPages(res?.data?.response[0]?.totalPages ?? 1);
    },
  });

  const listCustomerSupportAgents = useMutation({
    mutationFn: () => api.post('accounts/customer-support-agents', {
      page: 0,
      page_size: 99999,
      sorting: 'name asc',
      show_active_only: false,
      roles: ["ROLE_CUSTOMER_SUPPORT_AGENT"],
    }),
    onSuccess: (res: any) => {
      const csaList = res.data.response.map((item: any) => ({
        label: [item.firstName, item.lastName].join(' ').trim(),
        value: item.idCode,
      }));
      setCustomerSupportAgents([...csaList,{label: 'Bürokratt', value: 'chatbot'}].sort((a,b) => {
        if (a.label.toLowerCase() < b.label.toLowerCase()) {
          return -1;
        }
        if (a.label.toLowerCase() > b.label.toLowerCase()) {
          return 1;
        }
        return 0;
      }));
    }
  });

  const updatePagePreferences = useMutation({
    mutationFn: (data: {
      page_results: number;
      selected_columns: string[];
    }) => {
      return api.post('accounts/update-page-preference', {
        user_id: userInfo?.idCode,
        page_name: window.location.pathname,
        page_results: data.page_results,
        selected_columns: `{"${data.selected_columns.join('","')}"}`
      });
    }
  });

  const getChatById = useMutation({
    mutationFn: () => {
      return api.post('chat/chat-by-id', {
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
        const ended = Date.parse(format(new Date(c.ended), 'MM/dd/yyyy'));
        return ended >= startDate && ended <= endDate;
      })
    );
  };

  const endedChatsColumns = useMemo(() => {
    const columns = getColumns({ copyValueToClipboard, setSelectedChat });

    if (selectedColumns.length === 0) {
      return columns;
    }

    return columns.filter((col) => selectedColumns.includes(col.id) || col.id === "detail");
  }, [copyValueToClipboard, setSelectedChat, selectedColumns]);

  const visibleColumnOptions = useMemo(
    () => [
      { label: t('chat.history.startTime'), value: 'created' },
      { label: t('chat.history.endTime'), value: 'ended' },
      { label: t('chat.history.csaName'), value: 'customerSupportDisplayName' },
      { label: t('global.name'), value: 'endUserName' },
      { label: t('global.idCode'), value: 'endUserId' },
      { label: t('chat.history.contact'), value: 'contactsMessage' },
      { label: t('chat.history.comment'), value: 'comment' },
      { label: t('chat.history.rating'), value: 'rating' },
      { label: t('chat.history.feedback'), value: 'feedback' },
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
            className="input-wrapper"
            label={t('chat.history.searchChats')}
            hideLabel
            name="searchChats"
            placeholder={t('chat.history.searchChats') + '...'}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedGetAllEnded(e.target.value);
            }}
          />
          <Track style={{ width: '100%' }} gap={16}>
            <Track gap={10}>
              <p>{t('global.from')}</p>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => 
                    <FormDatepicker
                      {...field}
                      label={''}
                      value={field.value ?? new Date()}
                      onChange={(v) => {
                        field.onChange(v);
                        const start = format(new Date(v), 'yyyy-MM-dd');
                        setSearchParams(params => { 
                          params.set('start', start)
                          return params;
                        });
                        getAllEndedChats.mutate({
                          startDate: start,
                          endDate: format(new Date(endDate), 'yyyy-MM-dd'),
                          customerSupportIds: passedCustomerSupportIds,
                          pagination,
                          sorting,
                          search,
                        });
                      }}
                    />
                  }
              />
            </Track>
            <Track gap={10}>
              <p>{t('global.to')}</p>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => 
                    <FormDatepicker
                      {...field}
                      label={''}
                      value={field.value ?? new Date()}
                      onChange={(v) => {
                        field.onChange(v);
                        const end = format(new Date(v), 'yyyy-MM-dd');
                        setSearchParams(params => { 
                          params.set('end', end)
                          return params;
                        });
                        getAllEndedChats.mutate({
                          startDate: format(new Date(startDate), 'yyyy-MM-dd'),
                          endDate: end,
                          customerSupportIds: passedCustomerSupportIds,
                          pagination,
                          sorting,
                          search,
                        });
                      }}
                    />
                }
              />
            </Track>
            <FormMultiselect
                key={counterKey}
                name="visibleColumns"
                label={t('')}
                placeholder={t('chat.history.chosenColumn')}
                options={visibleColumnOptions}
                selectedOptions={visibleColumnOptions.filter((o) =>
                    selectedColumns.includes(o.value)
                )}
                onSelectionChange={(selection) => {
                  const columns = selection?.map((s) => s.value) ?? [];
                  const result = columns.length === 0 ? [] : [...columns, "detail"]
                  setSelectedColumns(result);
                  updatePagePreferences.mutate({page_results: pagination.pageSize, selected_columns: result})
                }}
            />
            <FormMultiselect
                name="agent"
                label={t('')}
                placeholder={t('chat.history.chosenCsa')}
                options={customerSupportAgents}
                selectedOptions={customerSupportAgents.filter((item) =>
                    passedCustomerSupportIds.includes(item.value)
                )}
                onSelectionChange={(selection) => {
                  setSearchParams((params) => {
                    params.delete('customerSupportIds');
                    selection?.forEach((s) =>
                        params.append('customerSupportIds', s.value)
                    );
                    return params;
                  });

                  getAllEndedChats.mutate({
                    startDate,
                    endDate,
                    customerSupportIds: selection?.map((s) => s.value) ?? [],
                    pagination,
                    sorting,
                    search,
                  });
                }}
            />
          </Track>
        </Track>
      </Card>

      <Card>
        <DataTable
          data={filteredEndedChatsList}
          sortable
          columns={endedChatsColumns.filter((c) => selectedColumns.length > 0 ? selectedColumns.includes(c.id ?? '') : true)}
          pagination={pagination}
          sorting={sorting}
          selectedRow={(row) => row.original.id === selectedChat?.id}
          setPagination={(state: PaginationState) => {
            if (
              state.pageIndex === pagination.pageIndex &&
              state.pageSize === pagination.pageSize
            )
              return;
            setPagination(state);
            updatePagePreferences.mutate({page_results: state.pageSize, selected_columns: selectedColumns});
            getAllEndedChats.mutate({
              startDate: format(new Date(startDate), 'yyyy-MM-dd'),
              endDate: format(new Date(endDate), 'yyyy-MM-dd'),
              customerSupportIds: passedCustomerSupportIds,
              pagination: state,
              sorting,
              search,
            });
          }}
          setSorting={(state: SortingState) => {
            setSorting(state);
            getAllEndedChats.mutate({
              startDate: format(new Date(startDate), 'yyyy-MM-dd'),
              endDate: format(new Date(endDate), 'yyyy-MM-dd'),
              customerSupportIds: passedCustomerSupportIds,
              pagination,
              sorting: state,
              search,
            });
          }}
          isClientSide={false}
          pagesCount={totalPages}
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
