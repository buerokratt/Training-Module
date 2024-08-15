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
import { deleteResponse, editResponse } from '../../../services/responses';
import { Rule, RuleDTO } from '../../../types/rule';
import { addStoryOrRule, deleteStoryOrRule, editStoryOrRule } from '../../../services/stories';

type Response = {
  name: string;
  text: string;
}

const Intents: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [intentResponseName, setIntentResponseName] = useState<string>('');
  const [intentResponseText, setIntentResponseText] = useState<string>('');

  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const [editingIntentTitle, setEditingIntentTitle] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [intentRule, setIntentRule] = useState<string>('');

  const [deletableIntent, setDeletableIntent] = useState<Intent | null>(null);
  const [connectableIntent, setConnectableIntent] = useState<Intent | null>(
    null
  );
  const [turnIntentToServiceIntent, setTurnIntentToServiceIntent] =
    useState<Intent | null>(null);

  let intentParam;

  const {
    data: intentsFullResponse,
    isLoading,
  } = useQuery({
    queryKey: ['intents/full'],
  });

  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });

  const { data: responsesFullResponse } = useQuery({
    queryKey: ['responses-list'],
  });

  const { data: rulesFullResponse } = useQuery({
    queryKey: ['rules'],
  })

  let intentsFullList = intentsFullResponse?.response?.intents;
  let intents: Intent[] = [];

  let intentResponsesFullList = responsesFullResponse ? responsesFullResponse[0].response : null;
  let intentResponses: Response[] = [];

  let rulesFullList = rulesFullResponse?.response;
  let rules: Rule[] = [];

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
      intents.push(newIntent);
    });
    intentParam = searchParams.get('intent');
  }

  if (intentResponsesFullList) {
    intentResponsesFullList?.forEach((response: any) => {
      const newIntentResponse: Response = {
        name: response.name,
        text: response.text,
      }
      intentResponses.push(newIntentResponse);
    });
  }

  if (rulesFullList) {
    rulesFullList.forEach((rule: any) => {
      rules.push(rule);
    });
  }

  useEffect(() => {
    if (!intentParam || intentsFullList?.length !== intents?.length) return;

    const queryIntent = intents.find(
      (intent) => intent.id === intentParam
    );

    if (queryIntent) {
      setSelectedIntent(queryIntent);
    }
  }, [intentParam]);

  const queryRefresh = useCallback(
    function queryRefresh(selectIntent: string | null) {
      setSelectedIntent(null);
      setIntentResponseName(null);
      setIntentResponseText(null);
      setIntentRule(null);

      queryClient.fetchQuery(['intents/full']).then((res: any) => {
        setRefreshing(false);

        if (intents.length > 0) {
          const newSelectedIntent = res.response.intents.find((intent: any) => intent.title === selectIntent) || null;
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

            queryClient.fetchQuery(['responses-list']).then((res: any) => {
              if (intentResponses.length > 0) {
                const intentExistingResponse = res[0].response.find((response: any) => `utter_${newSelectedIntent.title}` === response.name);
                if (intentExistingResponse) {
                  setIntentResponseText(intentExistingResponse.text);
                  setIntentResponseName(intentExistingResponse.name);
                }
              }
            })

            queryClient.fetchQuery(['rules']).then((res: any) => {
              if (rules.length > 0) {
                const intentExistingRule = res.response.find((rule: any) => rule.id === `rule_${newSelectedIntent.title}`)
                if (intentExistingRule) {
                  setIntentRule(intentExistingRule.id);
                }
              }
            })
          }
        }
      });
    },
    [intents, intentResponses, rules]
  );

  function isValidDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  const updateSelectedIntent = (updatedIntent: Intent) => {
    setSelectedIntent(null);
    setTimeout(() => setSelectedIntent(updatedIntent), 20);
  };

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
      queryRefresh(selectedIntent!.id);
    },
  });

  const deleteIntentMutation = useMutation({
    mutationFn: (name: string) => deleteIntent({ name }),
    onMutate: () => {
      setRefreshing(true);
      setDeletableIntent(null);
      setConnectableIntent(null);
      setSelectedIntent(null);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents/full']);
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
      queryRefresh('');
    },
  });

  const intentModifiedMutation = useMutation({
    mutationFn: (data: { intentName: string }) => getLastModified(data),
  });

  const turnIntentIntoServiceMutation = useMutation({
    mutationFn: ({ intent }: { intent: Intent }) =>
      turnIntentIntoService(intent),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: (_, { intent }) => {
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
    onSettled: () => {
      setRefreshing(false);
      queryRefresh(selectedIntent?.id || '');
    },
  });

  useDocumentEscapeListener(() => setEditingIntentTitle(null));

  const filteredIntents = useMemo(() => {
    if (!intents) return [];
    const formattedFilter = filter.trim().replace(/\s+/g, '_');
    return intents.filter((intent) => intent.id?.includes(formattedFilter))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [intents, filter]);

  const examplesData = useMemo(
    () => selectedIntent?.examples.map((example, index) => ({ id: index, value: example })),
    [selectedIntent?.examples]
  );

  const handleTabsValueChange = useCallback(
    (value: string) => {
      setEditingIntentTitle(null);
      setSelectedIntent(null);
      setIntentResponseName(null);
      setIntentResponseText(null);

      if (!intents) return;
      const selectedIntent = intents.find((intent) => intent.id === value);
      if (selectedIntent) {
        queryRefresh(selectedIntent?.id || '');
        intentModifiedMutation.mutate(
          { intentName: selectedIntent.id },
          {
            onSuccess: (data) => {
              selectedIntent.modifiedAt = data.response;
              setSelectedIntent(selectedIntent);
            },
            onError: (error) => {
              selectedIntent.modifiedAt = '';
              setSelectedIntent(selectedIntent);
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
    onSuccess: () => {
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
      setRefreshing(false);
      queryRefresh(filter.trim().replace(/\s+/g, '_'))
      setFilter('');
    },
  });

  const intentEditMutation = useMutation({
    mutationFn: (editIntentData: { oldName: string; newName: string }) =>
      editIntent(editIntentData),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents/full']);
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
    onSuccess: () => {
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
      queryRefresh(selectedIntent?.id || '');
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
    onSettled: () => {
      setRefreshing(false);
      queryRefresh(selectedIntent?.id || '');
    },
  });

  const handleNewExample = (example: string) => {
    if (!selectedIntent) return;
    addExamplesMutation.mutate({
      intentName: selectedIntent.id,
      intentExamples: selectedIntent.examples,
      newExamples: example.replace(/(\t|\n)+/g, ' ').trim(),
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
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['response-list']);
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
      setRefreshing(false);
    },
  });

  const deleteResponseMutation = useMutation({
    mutationFn: (response: string) => deleteResponse({ response }),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['response-list']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.responseDeleted'),
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
  })

  const addRuleMutation = useMutation({
    mutationFn: ({ data }: {data: RuleDTO}) => addStoryOrRule(data as RuleDTO, "rules"),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.storyAdded'),
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
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: (id: string | number) => deleteStoryOrRule(id, 'rules'),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['rules']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.storyDeleted'),
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
    },
  });

  const deleteRuleWithIntentMutation = useMutation({
    mutationFn: (id: string | number) => deleteStoryOrRule(id, 'rules'),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['response-list']);
      await queryClient.invalidateQueries(['rules']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.storyDeleted'),
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
      deleteIntentMutation.mutate(deletableIntent!.id);
      setRefreshing(false);
    },
  });

  const prepareEditIntentName = async () => {
    if (!selectedIntent || !editingIntentTitle) return;

    const newId = editingIntentTitle.replace(/\s+/g, '_');

    await deleteResponseMutation.mutateAsync(intentResponseName);
    await deleteRuleMutation.mutateAsync(intentRule);

    await addRuleMutation.mutateAsync({
      data: {
        rule: `rule_${newId}`,
        steps: [
          {
            intent: newId,
          },
          {
            action: `utter_${newId}`,
          }
        ]
      }
    });

    await addOrEditResponseMutation.mutateAsync({
      id: `utter_${newId}`,
      responseText: intentResponseText,
      update: false
    });

    handleIntentResponseSubmit(newId);
  }

  const handleDeleteIntent = async () => {
    if (intentRule) {
      await deleteRuleWithIntentMutation.mutateAsync(intentRule);
    } else {
      await deleteIntentMutation.mutateAsync(deletableIntent!.id)
    }
  }

  const handleIntentResponseSubmit = async (newId?: string) => {
    if (!intentResponseText || intentResponseText == '' || !selectedIntent) return;

    const intentId = newId || selectedIntent.id;

    await addOrEditResponseMutation.mutate({
      id: `utter_${intentId}`,
      responseText: intentResponseText,
      update: !!intentResponseName
    });

    if (!intentResponseName) {
      await addRuleMutation.mutate({
        data: {
          rule: `rule_${intentId}`,
          steps: [
            {
              intent: intentId,
            },
            {
              action: `utter_${intentId}`,
            }
          ]
        }
      });
    }

    if (editingIntentTitle) {
      await intentEditMutation.mutateAsync({
        oldName: selectedIntent.id,
        newName: newId,
      });
      queryRefresh(intentId);
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
          value={selectedIntent?.id || undefined}
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
                value={intent.id}
              >
                <Track gap={16}>
                  <span style={{ flex: 1 }}>
                    {intent.id.replace(/_/g, ' ')}
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
              key={selectedIntent.id}
              className="vertical-tabs__body"
              value={selectedIntent.id}
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
                        <h3>{selectedIntent.id.replace(/_/g, ' ')}</h3>
                      )}
                      {editingIntentTitle ? (
                        <Button
                          appearance="text"
                          onClick={prepareEditIntentName}
                        >
                          <Icon icon={<MdOutlineSave />} />
                          {t('global.save')}
                        </Button>
                      ) : (
                        <Button
                          appearance="text"
                          onClick={() =>
                            setEditingIntentTitle(selectedIntent!.id.replace(/_/g, ' '))
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
                {selectedIntent?.examples && (
                  <Track align="stretch" justify="between" gap={10} style={{ width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <IntentExamplesTable
                        examples={examplesData}
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
                          <h1>{t('training.intents.responseTitle')}</h1>
                          <FormTextarea
                            label={t('global.addNew')}
                            value={intentResponseText}
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
                          onClick={() => handleIntentResponseSubmit()}
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
                onClick={() => handleDeleteIntent()}
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
          intent={connectableIntent.id}
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

      {(refreshing) && (
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
