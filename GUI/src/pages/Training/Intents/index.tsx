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

import { Button, Dialog, FormInput, Icon, Tooltip, Track } from 'components';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { useToast } from 'hooks/useToast';
import { Intent } from 'types/intent';
import { Entity } from 'types/entity';
import {
  addExample,
  addIntent,
  deleteIntent,
  editIntent,
  turnIntentIntoService,
} from 'services/intents';
import IntentExamplesTable from './IntentExamplesTable';

const Intents: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('');
  const [editingIntentTitle, setEditingIntentTitle] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [deletableIntent, setDeletableIntent] = useState<
    string | number | null
  >(null);
  const [turnIntentToServiceIntent, setTurnIntentToServiceIntent] = useState<
    Intent | null
  >(null);

  // const { data: intents } = useQuery<Intent[]>({
  //   queryKey: ['intents'],
  // });

  const { data: apiResponseIntents } = useQuery({
    queryKey: ['intents'],
  });

  const { data: apiResponseInModel } = useQuery({
    queryKey: ['intents/in-model'],
  });

    // if (isLoading) {
    //
    // } else if (error) {
    //
    // }

  console.log('apiResponseModel ::: ', apiResponseInModel);

  // const intents: Intent[] = apiResponseIntents?.response?.intents ?? [];
  const intentTitles = apiResponseIntents?.response?.intents ?? [];
  const inModelTitles = apiResponseInModel?.response ?? [];

  // const { data: apiResponseInModel } = useQuery({
  //   queryKey: ['intents/in-model'],
  // });

  const { data: examples } = useQuery<string[]>({
    queryKey: [`intents/${selectedIntent?.id}/examples`, selectedIntent?.id],
    enabled: !!selectedIntent,
  });

  const intents : Intent[] = Array.isArray(intentTitles)
    ? intentTitles.map(( title: string, index: number ) => ({
          id: index +1,
          intent: title,
          description: null,
          inModel: inModelTitles.includes(title),
          modifiedAt: '',
          examplesCount: null,
          }))
      : [];

  console.log('Index page intents: ', intents);
  console.log('examples', examples);

  const { data: apiResponseEntities } = useQuery({
    queryKey: ['entities'],
  });

  const entities = apiResponseEntities?.response?.entities ?? [];
  console.log('entities', entities);


  const serviceModuleGuiBaseUrl = import.meta.env.REACT_APP_SERVICE_MODULE_GUI_BASE_URL;

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
    mutationFn: ({ intentId, example }: { intentId: string | number; example: string; }) => {
      return addExample(intentId, { example });
    },
    onSuccess: async () => {
      if (selectedIntent) {
        await queryClient.invalidateQueries({
          queryKey: [`intents/${selectedIntent.id}/examples`],
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
  });

  const removeFromModelMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: { inModel: boolean };
    }) => editIntent(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Intent removed from model',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
  });

  const deleteIntentMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteIntent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents']);
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

  // console.log("FILTERED: " + filteredIntents);

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
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents']);
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
    onSettled: () => setFilter(''),
  });

  const intentEditMutation = useMutation({
    mutationFn: ({ id, intent }: { id: string | number; intent: string }) =>
      editIntent(id, { intent }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents']);
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
    onSettled: () => setEditingIntentTitle(null),
  });

  if (!intents) return <>Loading...</>;

  const handleNewExample = (example: string) => {
    if (!selectedIntent) return;
    addExamplesMutation.mutate({ intentId: selectedIntent.id, example });
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
                              id: selectedIntent.id,
                              intent: editingIntentTitle,
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
                    <p style={{ color: '#4D4F5D' }}>
                      {`${t('global.modifiedAt')} ${format(
                        new Date(selectedIntent.modifiedAt),
                        'dd.MM.yyyy'
                      )}`}
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
                          removeFromModelMutation.mutate({
                            id: selectedIntent.id,
                            data: { inModel: false },
                          })
                        }
                      >
                        {t('training.intents.removeFromModel')}
                      </Button>
                    ) : (
                      <Button>{t('training.intents.addToModel')}</Button>
                    )}
                    <Button
                      appearance="error"
                      onClick={() => setDeletableIntent(selectedIntent.id)}
                    >
                      {t('global.delete')}
                    </Button>
                  </Track>
                </Track>
              </div>
              <div className="vertical-tabs__content">
                {examples && (
                  <IntentExamplesTable
                    examples={examples}
                    onAddNewExample={handleNewExample}
                    entities={entities ?? []}
                    selectedIntent={selectedIntent}
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
                  deleteIntentMutation.mutate({ id: deletableIntent })
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
    </>
  );
};

export default Intents;
