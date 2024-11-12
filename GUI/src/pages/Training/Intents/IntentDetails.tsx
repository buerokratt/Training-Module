import { Track, FormInput, Button, Icon, Switch, Tooltip, FormTextarea, Dialog } from 'components';
import { isHiddenFeaturesEnabled, RESPONSE_TEXT_LENGTH } from 'constants/config';
import { format } from 'date-fns';
import { t } from 'i18next';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { MdOutlineSave, MdOutlineModeEditOutline } from 'react-icons/md';
import { Intent } from 'types/intent';
import IntentExamplesTable from './IntentExamplesTable';
import * as Tabs from '@radix-ui/react-tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  addExample,
  addRemoveIntentModel,
  deleteIntent,
  downloadExamples,
  editIntent,
  markForService,
  uploadExamples,
} from 'services/intents';
import { useToast } from 'hooks/useToast';
import { ROLES } from 'hoc/with-authorization';
import useStore from '../../../store/store';
import { editResponse } from 'services/responses';
import { addStoryOrRule, deleteStoryOrRule } from 'services/stories';
import { RuleDTO } from 'types/rule';
import ConnectServiceToIntentModal from 'pages/ConnectServiceToIntentModal';
import LoadingDialog from 'components/LoadingDialog';
import { Entity } from 'types/entity';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { IntentWithExamplesCount } from 'types/intentWithExampleCounts';

type Response = {
  name: string;
  text: string;
};

interface IntentDetailsProps {
  intentId: string;
  entities: Entity[];
  setSelectedIntent: Dispatch<SetStateAction<IntentWithExamplesCount | null>>;
  // todo maybe remove and invalidate istead
  listRefresh: (intent?: string) => void;
}

const IntentDetails: FC<IntentDetailsProps> = ({ intentId, setSelectedIntent, entities, listRefresh }) => {
  const [intent, setIntent] = useState<Intent | null>(null);

  const [editingIntentTitle, setEditingIntentTitle] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isMarkedForService, setIsMarkedForService] = useState<boolean>(false);
  const [connectableIntent, setConnectableIntent] = useState<Intent | null>(null);
  const [deletableIntent, setDeletableIntent] = useState<Intent | null>(null);
  const [intentResponseText, setIntentResponseText] = useState<string>('');
  // todo two unused come from queryRefresh
  const [intentResponseName, setIntentResponseName] = useState<string>('');
  const [intentRule, setIntentRule] = useState<string>('');

  const queryClient = useQueryClient();
  const toast = useToast();

  // todo use type
  const { data: intentResponse } = useQuery<{ response: Intent }>({
    queryKey: [`intents/by-id?intent=${intentId}`],
  });

  // todo check IntentExamplesTable for /full query - and if changed, remove all related stuff

  useEffect(() => {
    if (intentResponse) {
      setIntent(intentResponse.response);
      // Also reset form states on choosing another intent from list
      setEditingIntentTitle(null);
      setIntentResponseText('');
    }
  }, [intentResponse]);

  const { data: isPossibleToUpdateMark, refetch } = useQuery<boolean>({
    queryKey: [`intents/is-marked-for-service?intent=${intentId}`],
  });

  const queryRefresh = useCallback(
    async (intent?: string) => {
      const response = await queryClient.fetchQuery<{ response: Intent }>([
        `intents/by-id?intent=${intent ?? intentId}`,
      ]);
      if (response) {
        setIntent(response.response);
        setSelectedIntent(response.response);
      }
      // todo setIsMarkedForService
      // todo also set intentResponseName and intentResponseText?

      // setIntentResponseName(null);
      // setIntentResponseText(null);
      // setIntentRule(null);
      // queryClient.fetchQuery(['intents/full']).then((res: any) => {
      //   setRefreshing(false);
      //   if (intents.length > 0) {
      //     const newSelectedIntent = res.response.intents.find((intent: any) => intent.title === selectIntent) || null;
      //     if (newSelectedIntent) {
      //       setSelectedIntent({
      //         id: newSelectedIntent.title,
      //         description: null,
      //         inModel: newSelectedIntent.inmodel,
      //         modifiedAt: newSelectedIntent.modifiedAt,
      //         examplesCount: newSelectedIntent.examples.length,
      //         examples: newSelectedIntent.examples,
      //         serviceId: newSelectedIntent.serviceId,
      //         isForService: newSelectedIntent.isForService,
      //       });
      //       setIsMarkedForService(newSelectedIntent.isForService ? newSelectedIntent.isForService : false);
      //       // queryClient.fetchQuery(['responses-list']).then((res: any) => {
      //       //   if (intentResponses.length > 0) {
      //       //     const intentExistingResponse = res[0].response.find((response: any) => `utter_${newSelectedIntent.title}` === response.name);
      //       //     if (intentExistingResponse) {
      //       //       setIntentResponseText(intentExistingResponse.text);
      //       //       setIntentResponseName(intentExistingResponse.name);
      //       //     }
      //       //   }
      //       // })
      //       // queryClient.fetchQuery(['rules']).then((res: any) => {
      //       //   if (rules.length > 0) {
      //       //     const intentExistingRule = res.response.find((rule: any) => rule.id === `rule_${newSelectedIntent.title}`)
      //       //     if (intentExistingRule) {
      //       //       setIntentRule(intentExistingRule.id);
      //       //     }
      //       //   }
      //       // })
      //     }
      //   }
      // });
    },
    [queryClient]
  );

  // todo these likely need new queries
  // todo test with: common teenus citizien initiative popular
  const { data: responsesFullResponse } = useQuery({
    queryKey: ['responses-list'],
  });

  const { data: rulesFullResponse } = useQuery({
    queryKey: ['rules'],
  });

  let intentResponsesFullList = responsesFullResponse ? responsesFullResponse[0].response : null;
  let intentResponses: Response[] = [];

  // let rulesFullList = rulesFullResponse?.response;
  // let rules: Rule[] = [];

  if (intentResponsesFullList) {
    intentResponsesFullList?.forEach((response: any) => {
      const newIntentResponse: Response = {
        name: response.name,
        text: response.text,
      };
      intentResponses.push(newIntentResponse);
    });
  }

  // if (rulesFullList) {
  //   rulesFullList.forEach((rule: any) => {
  //     rules.push(rule);
  //   });
  // }

  const queryRefreshOld = useCallback(
    function queryRefresh(selectIntent?: string) {
      setSelectedIntent(null);
      setIntentResponseName(null);
      setIntentResponseText(null);
      setIntentRule(null);

      queryClient.fetchQuery(['intents/with-examples-count']).then((res: any) => {
        setRefreshing(false);

        if (intents.length > 0) {
          const newSelectedIntent = res.response.intents.find((intent: any) => intent.title === selectIntent) || null;
          if (newSelectedIntent) {
            setSelectedIntent({
              id: newSelectedIntent.title,
              description: null,
              inModel: newSelectedIntent.inmodel,
              modifiedAt: newSelectedIntent.modifiedAt,
              examplesCount: newSelectedIntent.examples.length,
              examples: newSelectedIntent.examples,
              serviceId: newSelectedIntent.serviceId,
              isForService: newSelectedIntent.isForService,
            });
            setIsMarkedForService(newSelectedIntent.isForService ? newSelectedIntent.isForService : false);

            queryClient.fetchQuery(['responses-list']).then((res: any) => {
              if (intentResponses.length > 0) {
                const intentExistingResponse = res[0].response.find(
                  (response: any) => `utter_${newSelectedIntent.title}` === response.name
                );
                if (intentExistingResponse) {
                  setIntentResponseText(intentExistingResponse.text);
                  setIntentResponseName(intentExistingResponse.name);
                }
              }
            });

            // queryClient.fetchQuery(['rules']).then((res: any) => {
            //   if (rules.length > 0) {
            //     const intentExistingRule = res.response.find((rule: any) => rule.id === `rule_${newSelectedIntent.title}`)
            //     if (intentExistingRule) {
            //       setIntentRule(intentExistingRule.id);
            //     }
            //   }
            // })
          }
        }
      });
    },
    [queryClient, setSelectedIntent]
  );

  const markIntentServiceMutation = useMutation({
    mutationFn: (data: { name: string; isForService: boolean }) => markForService(data),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.intentUpdated'),
      });
      setIsMarkedForService(!isMarkedForService);
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

  const updateMarkForService = (value: boolean) => {
    refetch().then((r) => {
      if (!r.data) {
        markIntentServiceMutation.mutate({ name: intent?.id ?? '', isForService: value });
      }
    });
  };

  const intentEditMutation = useMutation({
    mutationFn: (editIntentData: { oldName: string; newName: string }) => editIntent(editIntentData),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents/with-examples-count']);
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

  const editIntentName = async () => {
    if (!intent || !editingIntentTitle) return;

    const newName = editingIntentTitle.replace(/\s+/g, '_');

    await intentEditMutation.mutateAsync({
      oldName: intent.id,
      newName,
    });

    queryRefresh(newName);
  };

  const isValidDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const serviceEligible = () => {
    const roles = useStore.getState().userInfo?.authorities;
    if (roles && roles.length > 0) {
      return (
        roles?.includes(ROLES.ROLE_ADMINISTRATOR) ||
        (roles?.includes(ROLES.ROLE_SERVICE_MANAGER) && roles?.includes(ROLES.ROLE_CHATBOT_TRAINER))
      );
    }
    return false;
  };

  const intentUploadMutation = useMutation({
    mutationFn: ({ intentName, formData }: { intentName: string; formData: File }) =>
      uploadExamples(intentName, formData),
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
      queryRefresh();
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
          intentName: intent?.id || '',
          formData: file,
        });
      } catch (error) {}
    });

    input.click();
  };

  const intentDownloadMutation = useMutation({
    mutationFn: (intentModelData: { intentName: string }) => downloadExamples(intentModelData),
    onSuccess: (data) => {
      // @ts-ignore
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = intent?.id + '.csv';
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

  const intentModelMutation = useMutation({
    mutationFn: (intentModelData: { name: string; inModel: boolean }) => addRemoveIntentModel(intentModelData),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: () => {
      if (intent?.inModel === true) {
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
      queryRefresh();
    },
  });

  const addOrEditResponseMutation = useMutation({
    mutationFn: (intentResponseData: { id: string; responseText: string; update: boolean }) =>
      editResponse(intentResponseData.id, intentResponseData.responseText, intentResponseData.update),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      // todo invalidate
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

  const addRuleMutation = useMutation({
    mutationFn: ({ data }: { data: RuleDTO }) => addStoryOrRule(data as RuleDTO, 'rules'),
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

  // todo clean up and fix errors
  const handleIntentResponseSubmit = async (newId?: string) => {
    if (!intentResponseText || intentResponseText == '' || !intent) return;

    const intentId = newId || intent.id;

    await addOrEditResponseMutation.mutate({
      id: `utter_${intentId}`,
      responseText: intentResponseText,
      update: !!intentResponseName,
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
            },
          ],
        },
      });
    }

    if (editingIntentTitle) {
      await intentEditMutation.mutateAsync({
        oldName: intent.id,
        newName: newId,
      });
      queryRefresh();
    }
  };

  const examplesData = useMemo(
    () => intent?.examples.map((example, index) => ({ id: index, value: example })),
    [intent?.examples]
  );

  const addExamplesMutation = useMutation({
    mutationFn: (addExamplesData: { intentName: string; intentExamples: string[]; newExamples: string }) =>
      addExample(addExamplesData),
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
      queryRefresh();
    },
  });

  const handleNewExample = (example: string) => {
    if (!intent) return;
    addExamplesMutation.mutate({
      intentName: intent.id,
      intentExamples: intent.examples,
      newExamples: example.replace(/(\t|\n)+/g, ' ').trim(),
    });
  };

  const deleteIntentMutation = useMutation({
    mutationFn: (name: string) => deleteIntent({ name }),
    onMutate: () => {
      setRefreshing(true);
      setDeletableIntent(null);
      setConnectableIntent(null);
      setSelectedIntent(null);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents/with-examples-count']);
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
      queryRefresh();
    },
  });

  const deleteRuleWithIntentMutation = useMutation({
    mutationFn: (id: string | number) => deleteStoryOrRule(id, 'rules'),
    onMutate: () => {
      setRefreshing(true);
    },
    onSuccess: async () => {
      // todo invalidate
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

  const handleDeleteIntent = async () => {
    if (intentRule) {
      await deleteRuleWithIntentMutation.mutateAsync(intentRule);
    } else {
      await deleteIntentMutation.mutateAsync(deletableIntent!.id);
    }
  };

  const updateSelectedIntent = (updatedIntent: Intent) => {
    setSelectedIntent(null);
    setTimeout(() => setSelectedIntent(updatedIntent), 20);
  };

  useDocumentEscapeListener(() => setEditingIntentTitle(null));

  if (!intent) return <>Loading...</>;

  return (
    <Tabs.Content key={intent.id} className="vertical-tabs__body" value={intent.id} style={{ overflowX: 'auto' }}>
      <div className="vertical-tabs__content-header">
        <Track direction="vertical" align="stretch" gap={8}>
          <Track justify="between">
            <Track gap={16}>
              {editingIntentTitle ? (
                <FormInput
                  label="Intent title"
                  name="intentTitle"
                  value={editingIntentTitle}
                  onChange={(e) => setEditingIntentTitle(e.target.value)}
                  hideLabel
                />
              ) : (
                <h3>{intent.id.replace(/_/g, ' ')}</h3>
              )}
              {editingIntentTitle ? (
                <Button appearance="text" onClick={editIntentName}>
                  <Icon icon={<MdOutlineSave />} />
                  {t('global.save')}
                </Button>
              ) : (
                <Button appearance="text" onClick={() => setEditingIntentTitle(intent.id.replace(/_/g, ' '))}>
                  <Icon icon={<MdOutlineModeEditOutline />} />
                  {t('global.edit')}
                </Button>
              )}
            </Track>
            <p style={{ color: '#4D4F5D' }}>
              {t('global.modifiedAt')}:
              {isValidDate(intent.modifiedAt)
                ? ` ${format(new Date(intent.modifiedAt), 'dd.MM.yyyy')}`
                : ` ${t('global.missing')}`}
            </p>
          </Track>
          {serviceEligible() && (
            <Track direction="vertical" align="stretch" gap={5}>
              <Switch
                label={t('training.intents.markForService')}
                onLabel={t('global.yes') ?? 'yes'}
                offLabel={t('global.no') ?? 'no'}
                onCheckedChange={(value) => updateMarkForService(value)}
                checked={isMarkedForService}
                disabled={isPossibleToUpdateMark}
              />
            </Track>
          )}
          <Track justify="end" gap={8} isMultiline={true}>
            <Button appearance="secondary" onClick={() => handleIntentExamplesUpload()}>
              {t('training.intents.upload')}
            </Button>
            <Button
              appearance="secondary"
              onClick={() =>
                intentDownloadMutation.mutate({
                  intentName: intent.id,
                })
              }
            >
              {t('training.intents.download')}
            </Button>
            {intent.inModel ? (
              <Button
                appearance="secondary"
                onClick={() =>
                  intentModelMutation.mutate({
                    name: intent.id,
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
                    name: intent.id,
                    inModel: false,
                  })
                }
              >
                {t('training.intents.addToModel')}
              </Button>
            )}
            {isHiddenFeaturesEnabled && serviceEligible() && (
              <Tooltip content={t('training.intents.connectToServiceTooltip')}>
                <span>
                  <Button appearance="secondary" onClick={() => setConnectableIntent(intent)}>
                    {intent.serviceId
                      ? t('training.intents.changeConnectedService')
                      : t('training.intents.connectToService')}
                  </Button>
                </span>
              </Tooltip>
            )}
            <Tooltip content={t('training.intents.deleteTooltip')} hidden={!intent.serviceId}>
              <span>
                <Button appearance="error" onClick={() => setDeletableIntent(intent)}>
                  {t('global.delete')}
                </Button>
              </span>
            </Tooltip>
          </Track>
        </Track>
      </div>

      <div className="vertical-tabs__content">
        {intent?.examples && (
          <Track align="stretch" justify="between" gap={10} style={{ width: '100%' }}>
            <div style={{ flex: 1 }}>
              {/* todo missing/broken props */}
              <IntentExamplesTable
                examples={examplesData}
                onAddNewExample={handleNewExample}
                entities={entities}
                selectedIntent={intent}
                // todo necessary,
                // queryRefresh={queryRefresh}
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
                <Button appearance="text" onClick={() => handleIntentResponseSubmit()}>
                  {t('global.save')}
                </Button>
              </Track>
            </div>
          </Track>
        )}
      </div>

      {deletableIntent !== null && (
        <Dialog
          title={t('training.responses.deleteIntent')}
          onClose={() => setDeletableIntent(null)}
          footer={
            <>
              <Button appearance="secondary" onClick={() => setDeletableIntent(null)}>
                {t('global.no')}
              </Button>
              <Button appearance="error" onClick={() => handleDeleteIntent()}>
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}

      {connectableIntent !== null && (
        <ConnectServiceToIntentModal intent={connectableIntent.id} onModalClose={() => setConnectableIntent(null)} />
      )}

      {refreshing && (
        <LoadingDialog title={t('global.updatingDataHead')}>
          <p>{t('global.updatingDataBody')}</p>
        </LoadingDialog>
      )}
    </Tabs.Content>
  );
};

export default IntentDetails;
