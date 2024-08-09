import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

import { Button, Dialog, FormInput, FormTextarea, Icon, Tooltip, Track } from 'components';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { useToast } from 'hooks/useToast';
import { Intent } from 'types/intent';
import { Entity } from 'types/entity';
import {
  addExample,
  addIntent,
  addRemoveIntentModel,
  deleteIntent,
  downloadExamples,
  editIntent,
  getLastModified,
  turnIntentIntoService,
  uploadExamples,
} from 'services/intents';
import IntentExamplesTable from './IntentExamplesTable';
import LoadingDialog from '../../../components/LoadingDialog';
import ConnectServiceToIntentModal from 'pages/ConnectServiceToIntentModal';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import { isHiddenFeaturesEnabled, RESPONSE_TEXT_LENGTH } from 'constants/config';
import { editResponse } from '../../../services/responses';
import { RuleDTO } from '../../../types/rule';
import { addStoryOrRule, editStoryOrRule } from '../../../services/stories';

type Response = {
  name: string;
  text: string;
}

const Intents: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const intentWithResponseRef = useRef<HTMLTextAreaElement>(null);
  const [intentResponseName, setIntentResponseName] = useState<string>('');
  const [intentResponseText, setIntentResponseText] = useState<string>('');
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingResponses, setRefreshingResponses] = useState(false);
  // const [refreshingRules, setRefreshingRules] = useState(false);
  const [editingIntentTitle, setEditingIntentTitle] = useState<string | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [selectedIntentResponse, setSelectedIntentResponse] = useState<Response | null>(null);
  const [deletableIntent, setDeletableIntent] = useState<Intent | null>(null);
  const [connectableIntent, setConnectableIntent] = useState<Intent | null>(
    null
  );
  const [turnIntentToServiceIntent, setTurnIntentToServiceIntent] =
    useState<Intent | null>(null);

  const {
    data: intentsFullResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['intents/full'],
  });

  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });

  const { data: responsesFullResponse, refetch: refetchResponses } = useQuery({
    queryKey: ['responses-list'],
  });

  let intentsFullList = intentsFullResponse?.response?.intents;
  let intents: Intent[] = [];

  let intentResponsesFullList = responsesFullResponse ? responsesFullResponse[0].responses : null;
  let intentResponses: Response[] = [];

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
        examples: intent.examples,
        serviceId: intent.serviceId,
      };
      intents.push(newIntent);
    });
  }

  if (intentResponsesFullList) {
    intentResponsesFullList?.forEach((response: any) => {
      const newIntentResponse: Response = {
        name: response.name,
        text: response.text,
      }
      intentResponses.push(newIntentResponse);
    })
  }

  const getExampleArrayForIntentId = (): string[] => {
    if (selectedIntent) {
      return selectedIntent.examples;
    } else {
      return [];
    }
  };

  const queryRefresh = useCallback(
    function queryRefresh(selectIntent: string | null) {
      setSelectedIntent(null);
      queryClient.fetchQuery(['intents/full']).then((res: any) => {
        setRefreshing(false);
        if (intents.length > 0) {
          const newSelectedIntent = res.response.intents.find((intent: any) => intent.title === selectIntent) || null;
          if (newSelectedIntent) {
            setSelectedIntent({
              id: newSelectedIntent.title,
              intent: newSelectedIntent.title.replace(/_/g, ' '),
              description: null,
              inModel: newSelectedIntent.inmodel,
              modifiedAt: '',
              examplesCount: newSelectedIntent.examples.length,
              examples: newSelectedIntent.examples,
              serviceId: newSelectedIntent.serviceId,
            });
            queryClient.fetchQuery(['responses-list']).then((res: any) => {
              setRefreshingResponses(false);
              if (intentResponses.length > 0) {
                const intentExistingResponse = res[0].response.find((response: any) => response.name.startsWith(`utter_${newSelectedIntent.id}`));
                if (intentExistingResponse) {
                  setSelectedIntentResponse({
                    name: intentExistingResponse.name,
                    text: intentExistingResponse.text,
                  });
                }
              }
            })
          }
        }
      });
    },
    [intents, queryClient]
  );

  function isValidDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  const updateSelectedIntent = (updatedIntent: Intent) => {
    setSelectedIntent(null);
    setTimeout(() => setSelectedIntent(updatedIntent), 20);
  };

  useEffect(() => {
    const queryIntentName = searchParams.get('intent');
    if (intents && queryIntentName) {
      const queryIntent = intents.find(
        (intent) => intent.intent === queryIntentName
      );
      if (queryIntent) {
        setSelectedIntent(queryIntent);
        setSelectedTab(queryIntentName);
      }
    }
  }, [intents, searchParams]);

  const addExamplesMutation = useMutation({
    mutationFn: (addExamplesData: {
      intentName: string;
      intentExamples: string[];
      newExamples: string;
    }) => addExample(addExamplesData),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents/full']);
      await queryClient.refetchQueries(['intents/full']);
      getExampleArrayForIntentId().push('');
      setRefreshing(false);
      if (selectedIntent) {
        setRefreshing(false);
      }
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
      queryRefresh(selectedIntent?.intent || '');
    },
  });

  const deleteIntentMutation = useMutation({
    mutationFn: (data: { name: string }) => deleteIntent(data),
    onMutate: () => {
      setRefreshing(true);
      setDeletableIntent(null);
      setConnectableIntent(null);
      setSelectedIntent(null);
      setSelectedTab(null);
    },
    onSuccess: async () => {
      queryRefresh(null);
      setRefreshing(false);
      setTimeout(() => refetch(), 800);
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
      intents = intents.filter(
        (intent) => intent.intent !== selectedIntent?.intent
      );
      setRefreshing(false);
    },
  });

  const intentModifiedMutation = useMutation({
    mutationFn: (data: { intentName: string }) => getLastModified(data),
  });

  const turnIntentIntoServiceMutation = useMutation({
    mutationFn: ({ intent }: { intent: Intent }) =>
      turnIntentIntoService(intent),
    onSuccess: async (_, { intent }) => {
      await queryClient.invalidateQueries(['intents']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.intentToServiceSuccess'),
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
    return intents.filter((intent) => intent.intent?.includes(filter))
      .sort((a, b) => a.intent.localeCompare(b.intent));
  }, [intents, filter]);

  const handleTabsValueChange = useCallback(
    (value: string) => {
      setEditingIntentTitle(null);
      setSelectedIntent(null);
      if (!intents) return;
      const selectedIntent = intents.find((intent) => intent.intent === value);
      if (selectedIntent) {
        queryRefresh(selectedIntent?.intent || '');
        intentModifiedMutation.mutate(
          { intentName: selectedIntent.intent },
          {
            onSuccess: (data) => {
              selectedIntent.modifiedAt = data.response;
              setSelectedIntent(selectedIntent);
              setSelectedTab(selectedIntent.intent);
            },
            onError: (error) => {
              selectedIntent.modifiedAt = '';
              setSelectedIntent(selectedIntent);
              setSelectedTab(selectedIntent.intent);
            },
          }
        );
      }
    },
    [intentModifiedMutation, intents, queryRefresh]
  );

  const newIntentMutation = useMutation({
    mutationFn: (data: { name: string }) => addIntent(data),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      queryRefresh(filter);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.newIntentAdded'),
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
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      queryRefresh(editingIntentTitle);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.intentTitleSaved'),
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
          message: t('toast.intentRemovedFromModel'),
        });
      } else {
        toast.open({
          type: 'success',
          title: t('global.notification'),
          message: t('toast.intentAddedToModel'),
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

  const intentDownloadMutation = useMutation({
    mutationFn: (intentModelData: { intentName: string }) =>
      downloadExamples(intentModelData),
    onSuccess: (data) => {
      // @ts-ignore
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedIntent?.id + '.csv';
      a.click();
      window.URL.revokeObjectURL(url);

      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.examplesSentForDownloading'),
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

  const intentUploadMutation = useMutation({
    mutationFn: ({
      intentName,
      formData,
    }: {
      intentName: string;
      formData: File;
    }) => uploadExamples(intentName, formData),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents/full']);
      await queryClient.refetchQueries(['intents/full']);
      getExampleArrayForIntentId().push('');
      setRefreshing(false);
      if (selectedIntent) {
        setRefreshing(false);
      }
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
    onSettled: () => {
      queryRefresh(selectedIntent?.intent || '');
    },
  });

  const handleNewExample = (example: string) => {
    if (!selectedIntent) return;
    addExamplesMutation.mutate({
      intentName: selectedIntent.intent,
      intentExamples: selectedIntent.examples,
      newExamples: example.trim(),
    });
  };

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

  const addOrEditResponseMutation = useMutation({
    mutationFn: (intentResponseData: {
      id: string,
      responseText: string,
      update: boolean
    }) => editResponse(intentResponseData.id, intentResponseData.responseText, intentResponseData.update),
    onMutate: async () => {
      await queryClient.invalidateQueries(['intents/full']);
      await queryClient.invalidateQueries(['response-list']);
      await queryClient.invalidateQueries(['rules']);

      setRefreshing(true);
      setRefreshingResponses(true);
      // setRefreshingRules(true);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(['intents/full']);
      await queryClient.refetchQueries(['response-list']);
      await queryClient.refetchQueries(['rules']);

      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.newResponseAdded'),
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
      setTimeout(() => refetchResponses(), 1100);
      queryRefresh(selectedIntent?.id || '');
      setRefreshing(false);
      setRefreshingResponses(false);
      // setRefreshingRules(false);
    },
  });

  const addRuleMutation = useMutation({
    mutationFn: ({ data }: {data: RuleDTO}) => addStoryOrRule(data as RuleDTO, "rules"),
    onMutate: async () => {
      await queryClient.invalidateQueries(['rules']);
      setRefreshing(true);
      setRefreshingResponses(true);
      // setRefreshingRules(true);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(['rules']);

      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.newRuleAdded'),
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
      setTimeout(() => refetchResponses(), 1100);
      queryRefresh(selectedIntent?.id || '');
      setRefreshing(false);
      setRefreshingResponses(false);
      // setRefreshingRules(false);
    },
  });

  const editRuleMutation = useMutation({
    mutationFn: ({id, data}: {
      id: string | number,
      data: RuleDTO
    }) => editStoryOrRule(id, data as RuleDTO, "rules"),
    onMutate: async () => {
      await queryClient.invalidateQueries(['rules']);
      setRefreshing(true);
      setRefreshingResponses(true);
      // setRefreshingRules(true);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(['rules']);

      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.newRuleAdded'),
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
      setTimeout(() => refetchResponses(), 1100);
      queryRefresh(selectedIntent?.id || '');
      setRefreshing(false);
      setRefreshingResponses(false);
      // setRefreshingRules(false);
    },
  });

  const handleEditIntent = () => {
    // intentEditMutation.mutate({
    //   oldName: selectedIntent!.intent,
    //   newName: editingIntentTitle,
    // });
    // if (intentResponseName) {
    //   storyEditMutation.mutate({
    //     id: string |number,
    //     storyData: RuleDTO,
    //     category: string,
    //   });
    // }
  }

  const handleIntentResponseSubmit = () => {
    if (!intentResponseText || intentResponseText == '' || !selectedIntent) return;

    addOrEditResponseMutation.mutate({
      id: `utter_${selectedIntent.id}`,
      responseText: intentResponseText,
      update: !!intentResponseName
    });

    if (intentResponseName) {
      editRuleMutation.mutate({
        id: `rule_${selectedIntent.id}`,
        data: {
          rule: `rule_${selectedIntent.id}`,
          steps: [
            {
              intent: selectedIntent.id,
            },
            {
              action: `utter_${selectedIntent.id}`,
            }
          ]
        }
      })
    } else {
      addRuleMutation.mutate({
        data: {
          rule: `rule_${selectedIntent.id}`,
          steps: [
            {
              intent: selectedIntent.id,
            },
            {
              action: `utter_${selectedIntent.id}`,
            }
          ]
        }
      })
    }
  }

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
                  onClick={() =>
                    newIntentMutation.mutate({ name: filter.trim() })
                  }
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
              style={{ overflowX: 'auto' }}
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
                          onClick={handleEditIntent}
                        >
                          <Icon icon={<MdOutlineSave />} />
                          {t('global.save')}
                        </Button>
                      ) : (
                        <Button
                          appearance="text"
                          onClick={() =>
                            setEditingIntentTitle(selectedIntent!.intent)
                          }
                        >
                          <Icon icon={<MdOutlineModeEditOutline />} />
                          {t('global.edit')}
                        </Button>
                      )}
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
                  <Track justify="end" gap={8} isMultiline={true}>
                    {
                      isHiddenFeaturesEnabled && (
                        <Button
                          appearance="secondary"
                          onClick={() =>
                            setTurnIntentToServiceIntent(selectedIntent)
                          }
                        >
                          {t('training.intents.turnIntoService')}
                        </Button>
                      )
                    }
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
                          intentName: selectedIntent.intent,
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
                            name: selectedIntent.intent,
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
                            name: selectedIntent.intent,
                            inModel: false,
                          })
                        }
                      >
                        {t('training.intents.addToModel')}
                      </Button>
                    )}
                    {
                      isHiddenFeaturesEnabled && (
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
                      )
                    }
                    <Tooltip
                      content={t('training.intents.deleteTooltip')}
                      hidden={!selectedIntent.serviceId}
                    >
                      <span>
                        <Button
                          appearance="error"
                          onClick={() => setDeletableIntent(selectedIntent)}
                        >
                          {t('global.delete')}
                        </Button>
                      </span>
                    </Tooltip>
                  </Track>
                </Track>
              </div>
              <div className="vertical-tabs__content">
                {getExampleArrayForIntentId() && (
                  <Track align="stretch" justify="between" gap={10} style={{ width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <IntentExamplesTable
                        examples={getExampleArrayForIntentId()}
                        onAddNewExample={handleNewExample}
                        entities={entities ?? []}
                        selectedIntent={selectedIntent}
                        queryRefresh={queryRefresh}
                        updateSelectedIntent={updateSelectedIntent}
                      />
                    </div>
                    <div>
                      <Track align="right" justify="between" direction="vertical" gap={100}>
                        <Track align="left" direction="vertical">
                          <h1>{t('intents.response.title')}</h1>
                          <FormTextarea
                            ref={intentWithResponseRef}
                            label={t('global.addNew')}
                            name="intentResponse"
                            minRows={7}
                            maxRows={7}
                            placeholder={t('global.addNew') + '...' || ''}
                            hideLabel
                            maxLength={RESPONSE_TEXT_LENGTH}
                            showMaxLength
                            onChange={(e) => setIntentResponseText(e.target.value)}
                            disableHeightResize
                          />
                        </Track>
                        <Button
                          appearance="text"
                          onClick={handleIntentResponseSubmit}
                        >
                          {t('global.save')}
                        </Button>
                      </Track>
                    </div>
                  </Track>
                )}
              </div>
            </Tabs.Content>
          )}
        </Tabs.Root>
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
                  deleteIntentMutation.mutate({ name: deletableIntent.intent })
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

      {connectableIntent !== null && (
        <ConnectServiceToIntentModal
          intent={connectableIntent.intent}
          onModalClose={() => setConnectableIntent(null)}
        />
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
      {(refreshing || refreshingResponses) && (
        <LoadingDialog title={t('global.updatingDataHead')}>
          <p>{t('global.updatingDataBody')}</p>
        </LoadingDialog>
      )}
    </>
  );
};

export default withAuthorization(Intents, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
