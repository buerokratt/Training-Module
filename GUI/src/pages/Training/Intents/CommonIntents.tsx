import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import { MdCheckCircleOutline } from 'react-icons/md';

import {
  Button,
  Card,
  Dialog,
  FormInput,
  Icon,
  Switch,
  Tooltip,
  Track,
} from 'components';
import { useToast } from 'hooks/useToast';
import { Intent } from 'types/intent';
import { Entity } from 'types/entity';
import {
  addExample,
  addRemoveIntentModel,
  deleteIntent,
  downloadExamples,
  getLastModified,
  uploadExamples,
} from 'services/intents';
import IntentExamplesTable from './IntentExamplesTable';
import LoadingDialog from '../../../components/LoadingDialog';
import ConnectServiceToIntentModal from 'pages/ConnectServiceToIntentModal';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import { saveCsv } from 'utils/save-csv';

const CommonIntents: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [commonIntentsEnabled, setCommonIntentsEnabled] = useState(true);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [deletableIntent, setDeletableIntent] = useState<
    string | number | null
  >(null);
  const [connectableIntent, setConnectableIntent] = useState<Intent | null>(
    null
  );
  const [filter, setFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  let intentParam;

  const { data: intentsFullResponse, isLoading } = useQuery({
    queryKey: ['intents/common'],
  });

  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });

  let intentsFullList = intentsFullResponse?.response?.intents;
  let commonIntents: Intent[] = [];

  if (intentsFullList) {
    intentsFullList.forEach((intent: any) => {
      const countExamples = intent.examples.length;
      const newIntent: Intent = {
        id: intent.title,
        description: null,
        inModel: intent.inmodel,
        modifiedAt: '',
        examplesCount: countExamples,
        examples: intent.examples,
        serviceId: intent.serviceId,
      };
      commonIntents.push(newIntent);
    });
    intentParam = searchParams.get('intent');
  }

  useEffect(() => {
    if (!intentParam || intentsFullList?.length !== commonIntents?.length) return;

    const queryIntent = commonIntents.find(
      (intent) => intent.id === intentParam
    );

    if (queryIntent) {
      setSelectedIntent(queryIntent);
    }
  }, [intentParam]);

  function isValidDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  const updateSelectedIntent = (updatedIntent: Intent) => {
    setSelectedIntent(null);
    setTimeout(() => setSelectedIntent(updatedIntent), 20);
  };

  const queryRefresh = useCallback(
    function queryRefresh(selectIntent: string | null) {
      setSelectedIntent(null);

      queryClient.fetchQuery(['intents/common']).then((res: any) => {
        setRefreshing(false);
        if (commonIntents.length > 0) {
          const newSelectedIntent = res.response.intents.find((intent) => intent.title === selectIntent) || null;
          if (newSelectedIntent) {
            setSelectedIntent({
              id: newSelectedIntent.title,
              description: null,
              inModel: newSelectedIntent.inmodel,
              modifiedAt: '',
              examplesCount: newSelectedIntent.examples.length,
              examples: newSelectedIntent.examples,
              serviceId: newSelectedIntent.serviceId,
            });
          }
        }
      });
    },
    [commonIntents, queryClient]
  );

  const addExamplesMutation = useMutation({
    mutationFn: (addExamplesData: {
      intentName: string;
      intentExamples: string[];
      newExamples: string;
    }) => addExample(addExamplesData),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.newExampleAdded'),
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
      queryRefresh(selectedIntent?.id || '');
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
          message: t('toast.intentRemovedFromModel'),
        });
      } else {
        toast.open({
          type: 'success',
          title: t('global.notification'),
          message: t('toast.intentAddedToModel'),
        });
      }
      queryRefresh(selectedIntent?.id || '');
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

  const deleteIntentMutation = useMutation({
    mutationFn: (data: { name: string }) => deleteIntent(data),
    onMutate: () => {
      setRefreshing(true);
      setDeletableIntent(null);
      setConnectableIntent(null);
    },
    onSuccess: async () => {
      setSelectedIntent(null);
      queryRefresh(null);
      setRefreshing(false);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.intentDeleted'),
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
      commonIntents = commonIntents.filter(
        (intent) => intent.id !== selectedIntent?.id
      );
      setRefreshing(false);
    },
  });

  const filteredIntents = useMemo(() => {
    if (!commonIntents) return [];
    const formattedFilter = filter.trim().replace(/\s+/g, '_');
    return commonIntents.filter((intent) => intent.id?.includes(formattedFilter))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [commonIntents, filter]);

  const intentModifiedMutation = useMutation({
    mutationFn: (data: { intentName: string }) => getLastModified(data),
  });

  const examplesData = useMemo(
    () => selectedIntent?.examples.map((example, index) => ({id: index, value: example})),
    [selectedIntent?.examples]
  );

  const handleTabsValueChange = useCallback(
    (value: string) => {
      setSelectedIntent(null);
      if (!commonIntents) return;
      const selectedIntent = commonIntents.find(
        (intent) => intent.id === value
      );
      if (selectedIntent) {
        queryRefresh(selectedIntent.id || '');
        intentModifiedMutation.mutate(
          { intentName: selectedIntent.id },
          {
            onSuccess: (data) => {
              selectedIntent.modifiedAt = data.response;
              setSelectedIntent(selectedIntent);
            },
            onError: () => {
              selectedIntent.modifiedAt = '';
              setSelectedIntent(selectedIntent);
            },
          }
        );
      }
    },
    [intentModifiedMutation, commonIntents, queryRefresh]
  );

  const handleNewExample = (example: string) => {
    if (!selectedIntent) return;
    addExamplesMutation.mutate({
      intentName: selectedIntent.id,
      intentExamples: selectedIntent.examples,
      newExamples: example,
    });
  };

  const intentDownloadMutation = useMutation({
    mutationFn: (intentModelData: { intentName: string }) =>
      downloadExamples(intentModelData),
    onSuccess: async (data) => {
      saveCsv(data, selectedIntent?.id || '');

      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.examplesSentForDownloading'),
      });
    },
    onError: (error: AxiosError) => {
      if (error.name !== 'AbortError') {
        toast.open({
          type: 'error',
          title: t('global.notificationError'),
          message: error.message,
        });      
      }
    },
  });

  const handleIntentExamplesUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.addEventListener('change', async (event) => {
      const fileInput = event.target as HTMLInputElement;
      const files = fileInput.files;

      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];

      try {
        await intentUploadMutation.mutateAsync({
          intentName: selectedIntent?.id || '',
          formData: file,
        });
      } catch (error) {}
    });

    input.click();
  };

  const intentUploadMutation = useMutation({
    mutationFn: ({
      intentName,
      formData,
    }: {
      intentName: string;
      formData: File;
    }) => uploadExamples(intentName, formData),
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.fileUploadedSuccessfully'),
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

  if (isLoading) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.intents.commonIntents')}</h1>

      <Card>
        <Track gap={16}>
          <div style={{ minWidth: 187 }}>
            <p>{t('training.intents.commonIntents')}</p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                textDecoration: 'underline',
              }}
            >
              <a href="#">{t('training.intents.moreFromGithub')}</a>
            </p>
          </div>
          <Switch
            label={t('training.intents.commonIntents')}
            hideLabel
            name="commonIntents"
            checked={commonIntentsEnabled}
            onCheckedChange={setCommonIntentsEnabled}
          />
        </Track>
      </Card>

      {commonIntentsEnabled && commonIntents && (
        <Tabs.Root
          id="tabs"
          className="vertical-tabs"
          orientation="vertical"
          value={selectedIntent?.id ?? undefined}
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
              </Track>
            </div>

            <div className="vertical-tabs__list-scrollable">
              {filteredIntents.map((intent, index) => (
                <Tabs.Trigger
                  key={`${intent}-${index}`}
                  className="vertical-tabs__trigger"
                  value={intent.id}
                >
                  <Track gap={16}>
                  <span style={{ flex: 1 }}>
                    {intent.id.replace(/^common_/, '').replace(/_/g, ' ')}
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
              ))}</div>
          </Tabs.List>

          {selectedIntent && (
            <Tabs.Content
              key={selectedIntent.id}
              className="vertical-tabs__body"
              value={selectedIntent.id}
              style={{ overflowX: 'auto' }}
            >
              <div className="vertical-tabs__content-header">
                <Track direction="vertical" align="stretch" gap={8}>
                  <Track justify="between">
                    <Track gap={16}>
                      <h3>{selectedIntent.id.replace(/^common_/, '').replace(/_/g, ' ')}</h3>
                    </Track>
                    <p style={{ color: '#4D4F5D' }}>
                      {t('global.modifiedAt')}:
                      {isValidDate(selectedIntent.modifiedAt)
                        ? ` ${format(
                            new Date(selectedIntent.modifiedAt),
                            'dd.MM.yyyy'
                          )}`
                        : ` ${t('global.missing')}`}
                    </p>
                  </Track>
                  <Track justify="end" gap={8}>
                    <Button
                      appearance="secondary"
                      onClick={() => handleIntentExamplesUpload()}
                    >
                      {t('training.intents.upload')}
                    </Button>
                    <Button
                      appearance="secondary"
                      onClick={() =>
                        intentDownloadMutation.mutate({
                          intentName: selectedIntent!.id,
                        })
                      }
                    >
                      {t('training.intents.download')}
                    </Button>
                    {selectedIntent.inModel ? (
                      <Button
                        appearance="secondary"
                        onClick={() =>
                          intentModelMutation.mutate({
                            name: selectedIntent!.id,
                            inModel: true,
                          })
                        }
                      >
                        {t('training.intents.removeFromModel')}
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          intentModelMutation.mutate({
                            name: selectedIntent!.id,
                            inModel: false,
                          })
                        }
                      >
                        {t('training.intents.addToModel')}
                      </Button>
                    )}
                    <Tooltip
                      content={t('training.intents.connectToServiceTooltip')}
                    >
                      <span>
                        <Button
                          appearance="secondary"
                          onClick={() => setConnectableIntent(selectedIntent)}
                        >
                          {selectedIntent.serviceId
                            ? t('training.intents.changeConnectedService')
                            : t('training.intents.connectToService')}
                        </Button>
                      </span>
                    </Tooltip>

                    <Tooltip
                      content={t('training.intents.deleteTooltip')}
                      hidden={!selectedIntent.serviceId}
                    >
                      <span>
                        <Button
                          appearance="error"
                          onClick={() => setDeletableIntent(selectedIntent!.id)}
                        >
                          {t('global.delete')}
                        </Button>
                      </span>
                    </Tooltip>
                  </Track>
                </Track>
              </div>
              <div className="vertical-tabs__content">
                 {selectedIntent?.examples && examplesData && (
                  <IntentExamplesTable
                    examples={examplesData}
                    onAddNewExample={handleNewExample}
                    entities={entities ?? []}
                    selectedIntent={selectedIntent}
                    queryRefresh={queryRefresh}
                    updateSelectedIntent={updateSelectedIntent}
                  />
                )}
              </div>
            </Tabs.Content>
          )}
        </Tabs.Root>
      )}

      {connectableIntent !== null && (
        <ConnectServiceToIntentModal
          intent={connectableIntent.id}
          onModalClose={() => setConnectableIntent(null)}
        />
      )}

      {deletableIntent !== null && (
        <Dialog
          title={t('training.responses.deleteIntent')}
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
                  deleteIntentMutation.mutate({ name: deletableIntent!.id })
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
        <LoadingDialog title={t('global.updatingDataHead')}>
          <p>{t('global.updatingDataBody')}</p>
        </LoadingDialog>
      )}
    </>
  );
};

export default withAuthorization(CommonIntents, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
