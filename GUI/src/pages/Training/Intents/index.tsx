import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import {
  MdCheckCircleOutline,
  MdOutlineModeEditOutline,
  MdOutlineSave,
} from 'react-icons/md';

import {Button, Dialog, FormInput, Icon, Tooltip, Track} from 'components';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { useToast } from 'hooks/useToast';
import { Intent } from 'types/intent';
import { Entity } from 'types/entity';
import {
  addExample,
  addIntent, addRemoveIntentModel,
  deleteIntent,
  editIntent,
  turnIntentIntoService,
} from 'services/intents';
import IntentExamplesTable from './IntentExamplesTable';
import LoadingDialog from "../../../components/LoadingDialog";

const Intents: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [editingIntentTitle, setEditingIntentTitle] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [deletableIntent, setDeletableIntent] = useState<Intent | null>(null);
  const [turnIntentToServiceIntent, setTurnIntentToServiceIntent] = useState<
    Intent | null
  >(null);

  const { data: intentsFullResponse, isLoading } = useQuery({
    queryKey: ['intents/intents-full'],
  });

  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });

  let intentsFullList = intentsFullResponse?.response?.data?.intents;
  const intents: Intent[] = [];

  if (intentsFullList) {
    intentsFullList.forEach((intent: any) => {
      const formattedTitle = intent.title.replace(/_/g, ' ');
      const countExamples = intent.examples.length;
      const newIntent: Intent = {
        id: intent.title,
        intent: formattedTitle,
        description: null,
        inModel: intent.inmodel,
        modifiedAt: '',
        examplesCount: countExamples,
        examples: intent.examples
      };
      intents.push(newIntent);
    });
  }

  const getExampleArrayForIntentId = (intent: Intent): string[] => {
    if (selectedIntent) {
      return selectedIntent.examples;
    } else {
      return [];
    }
  };

  function queryRefresh(selectIntent: string | null) {
    setSelectedIntent(null);
    queryClient.cancelQueries(['intents/intents-full']);
    queryClient.fetchQuery(['intents/intents-full']).then(() => {
      setRefreshing(false);
      if (intents.length > 0) {
        setSelectedIntent(() => {
          return intents.find((intent) => intent.intent === selectIntent) || null;
        });
      }
    })
  }

  function isValidDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  useEffect(() => {
    const queryIntentName = searchParams.get('intent');
    if (intents && queryIntentName) {
      const queryIntent = intents.find((intent) => intent.intent === queryIntentName);
      if (queryIntent) {
        setSelectedIntent(queryIntent);
        setSelectedTab(queryIntentName);
      }
    }
  }, [intents, searchParams]);

  const addExamplesMutation = useMutation({
    mutationFn: (addExamplesData: { intentName: string, intentExamples: string[], newExamples: string }) =>
        addExample(addExamplesData),
    onSuccess: async () => {
      if (selectedIntent) {
        await queryClient.invalidateQueries({
          queryKey: [`intents/intents-full`],
        });
      }
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New example added',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => {
      queryRefresh(selectedIntent?.intent || '');
    }
  });

  const deleteIntentMutation = useMutation({
    mutationFn: (data: { name: string }) => deleteIntent(data),
    onMutate: () => {
      setRefreshing(true);
      setDeletableIntent(null) },
    onSuccess: async () => {
      setSelectedIntent(null)
      queryRefresh(null);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Intent deleted',
      });
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
    }
  });

  const turnIntentIntoServiceMutation = useMutation({
    mutationFn: ({ intent }: { intent: Intent }) => turnIntentIntoService(intent),
    onSuccess: async (_, { intent }) => {
      await queryClient.invalidateQueries(['intents']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Intent to Service - success',
      });
      window.location.href = `${serviceModuleGuiBaseUrl}/services/newService/${intent.intent}`;
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
  });

  useDocumentEscapeListener(() => setEditingIntentTitle(null));

  const filteredIntents = useMemo(() => {
    if (!intents) return [];
    return intents.filter((intent) => intent.intent?.includes(filter));
  }, [intents, filter]);

  const handleTabsValueChange = useCallback(
    (value: string) => {
      setEditingIntentTitle(null);
      if (!intents) return;
      const selectedIntent = intents.find((intent) => intent.intent === value);
      if (selectedIntent) {
        setSelectedIntent(selectedIntent);
        setSelectedTab(selectedIntent.intent);
      }
    },
    [intents]
  );

  const newIntentMutation = useMutation({
    mutationFn: (data: { name: string }) => addIntent(data),
    onMutate: () => { setRefreshing(true) },
    onSuccess: async () => {
      queryRefresh(filter);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New intent added',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => {
      setFilter('');
      setRefreshing(false);
    },
  });

  const intentEditMutation = useMutation({
    mutationFn: (editIntentData: { oldName: string; newName: string }) =>
        editIntent(editIntentData),
    onMutate: () => { setRefreshing(true); },
    onSuccess: async () => {
      queryRefresh(editingIntentTitle);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Intent title saved',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => {
      setEditingIntentTitle(null);
      setRefreshing(false);
    },
  });

  const intentModelMutation = useMutation({
    mutationFn: (intentModelData: { name: string; inModel: boolean }) =>
        addRemoveIntentModel(intentModelData),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      if (selectedIntent?.inModel === true) {
        toast.open({
          type: 'success',
          title: t('global.notification'),
          message: 'Intent removed from model',
        });
      } else {
        toast.open({
          type: 'success',
          title: t('global.notification'),
          message: 'Intent added to model',
        });
      }
      queryRefresh(selectedIntent?.intent || '');
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => {
      setEditingIntentTitle(null);
      setRefreshing(false);
    },
  });

  const handleNewExample = (example: string) => {
    if (!selectedIntent) return;
    addExamplesMutation.mutate({
        intentName: selectedIntent.intent,
        intentExamples: selectedIntent.examples,
        newExamples: example
    });
  };

  const handleIntentExamplesUpload = (intentId: string | number) => {
    // TODO: Add endpoint for mocking intent examples file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.click();
  };

  const handleIntentExamplesDownload = (intentId: string | number) => {
    // TODO: Add endpoint for mocking intent examples download
  };

  if (isLoading) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.intents.title')}</h1>
      {intents && (
        <Tabs.Root
          id="tabs"
          className="vertical-tabs"
          orientation="vertical"
          value={selectedTab ?? undefined}
          onValueChange={handleTabsValueChange}
        >
          <Tabs.List
            className="vertical-tabs__list"
            aria-label={t('training.intents.title') || ''}
          >
            <div className="vertical-tabs__list-search">
              <Track gap={8}>
                <FormInput
                  name="intentSearch"
                  label={t('training.intents.searchIntentPlaceholder')}
                  placeholder={
                    t('training.intents.searchIntentPlaceholder') + '...' || ''
                  }
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  hideLabel
                />
                <Button
                  onClick={() => newIntentMutation.mutate({ name: filter })}
                  disabled={!filter}
                >
                  {t('global.add')}
                </Button>
              </Track>
            </div>

            {filteredIntents.map((intent, index) => (
              <Tabs.Trigger
                key={`${intent}-${index}`}
                className="vertical-tabs__trigger"
                value={intent.intent}
              >
                <Track gap={16}>
                  <span style={{ flex: 1 }}>
                    {intent.intent.replace(/^common_/, '')}
                  </span>
                  <Tooltip content={t('training.intents.amountOfExamples')}>
                    <span style={{ color: '#5D6071' }}>
                      {intent.examplesCount}
                    </span>
                  </Tooltip>
                  {intent.inModel ? (
                    <Tooltip content={t('training.intents.intentInModel')}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon
                          icon={
                            <MdCheckCircleOutline
                              color={'rgba(0, 0, 0, 0.54)'}
                              opacity={intent.inModel ? 1 : 0}
                            />
                          }
                        />
                      </span>
                    </Tooltip>
                  ) : (
                    <span style={{ display: 'block', width: 16 }}></span>
                  )}
                </Track>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {selectedIntent && (
            <Tabs.Content
              key={selectedIntent.intent}
              className="vertical-tabs__body"
              value={selectedIntent.intent}
            >
              <div className="vertical-tabs__content-header">
                <Track direction="vertical" align="stretch" gap={8}>
                  <Track justify="between">
                    <Track gap={16}>
                      {editingIntentTitle ? (
                        <FormInput
                          label="Intent title"
                          name="intentTitle"
                          value={editingIntentTitle}
                          onChange={(e) =>
                            setEditingIntentTitle(e.target.value)
                          }
                          hideLabel
                        />
                      ) : (
                        <h3>{selectedIntent.intent}</h3>
                      )}
                      {editingIntentTitle ? (
                        <Button
                          appearance="text"
                          onClick={() =>
                            intentEditMutation.mutate({
                              oldName: selectedIntent.intent,
                              newName: editingIntentTitle,
                            })
                          }
                        >
                          <Icon icon={<MdOutlineSave />} />
                          {t('global.save')}
                        </Button>
                      ) : (
                        <Button
                          appearance="text"
                          onClick={() =>
                            setEditingIntentTitle(selectedIntent.intent)
                          }
                        >
                          <Icon icon={<MdOutlineModeEditOutline />} />
                          {t('global.edit')}
                        </Button>
                      )}
                    </Track>
                    <p style={{ color: '#4D4F5D' }}>{t('global.modifiedAt')}:
                      {isValidDate(selectedIntent.modifiedAt) ? (
                          ` ${format(
                              new Date(selectedIntent.modifiedAt),
                              'dd.MM.yyyy'
                          )}`
                      ) : (
                          ` ${t('global.missing')}`
                      )}
                    </p>

                  </Track>
                  <Track justify="end" gap={8} isMultiline={true}>
                    <Button
                      appearance="secondary"
                      onClick={() =>
                        setTurnIntentToServiceIntent(selectedIntent)
                      }
                    >
                      {t('training.intents.turnIntoService')}
                    </Button>
                    <Button
                      appearance="secondary"
                      onClick={() =>
                        handleIntentExamplesUpload(selectedIntent.id)
                      }
                    >
                      {t('training.intents.upload')}
                    </Button>
                    <Button
                      appearance="secondary"
                      onClick={() =>
                        handleIntentExamplesDownload(selectedIntent.id)
                      }
                    >
                      {t('training.intents.download')}
                    </Button>
                    {selectedIntent.inModel ? (
                      <Button
                        appearance="secondary"
                        onClick={() =>
                          intentModelMutation.mutate({
                            name: selectedIntent.intent,
                            inModel: true,
                          })
                        }
                      >
                        {t('training.intents.removeFromModel')}
                      </Button>
                    ) : (
                        <Button onClick={() =>
                            intentModelMutation.mutate({
                              name: selectedIntent.intent,
                              inModel: false
                            })
                        }>{t('training.intents.addToModel')}</Button>
                    )}
                    <Button
                      appearance="error"
                      onClick={() => setDeletableIntent(selectedIntent)}
                    >
                      {t('global.delete')}
                    </Button>
                  </Track>
                </Track>
              </div>
              <div className="vertical-tabs__content">
                {getExampleArrayForIntentId(selectedIntent) && (
                  <IntentExamplesTable
                    examples={getExampleArrayForIntentId(selectedIntent) }
                    onAddNewExample={handleNewExample}
                    entities={entities ?? []}
                    selectedIntent={selectedIntent}
                    queryRefresh={queryRefresh}
                  />
                )}
              </div>
            </Tabs.Content>
          )}
        </Tabs.Root>
      )}

      {deletableIntent !== null && (
        <Dialog
          title={t('training.responses.deleteResponse')}
          onClose={() => setDeletableIntent(null)}
          footer={
            <>
              <Button
                appearance="secondary"
                onClick={() => setDeletableIntent(null)}
              >
                {t('global.no')}
              </Button>
              <Button
                appearance="error"
                onClick={() =>
                  deleteIntentMutation.mutate({name: deletableIntent.intent })
                }
              >
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}
      {turnIntentToServiceIntent !== null && (
        <Dialog
          title={t('training.intents.turnIntoService')}
          onClose={() => setTurnIntentToServiceIntent(null)}
          footer={
            <>
              <Button
                appearance="secondary"
                onClick={() => setTurnIntentToServiceIntent(null)}
              >
                {t('global.no')}
              </Button>
              <Button
                appearance="error"
                onClick={() =>
                  turnIntentIntoServiceMutation.mutate({
                    intent: turnIntentToServiceIntent,
                  })
                }
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
         <LoadingDialog title={t('global.updatingDataHead')} >
              <p>{t('global.updatingDataBody')}</p>
         </LoadingDialog>
      )}
    </>
  );
};

export default Intents;
