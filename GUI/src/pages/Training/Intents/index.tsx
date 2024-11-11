import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import { MdOutlineModeEditOutline, MdOutlineSave } from 'react-icons/md';

import { Button, Dialog, FormInput, FormTextarea, Icon, Switch, Tooltip, Track } from 'components';
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
  markForService,
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
import { addStoryOrRule, deleteStoryOrRule } from '../../../services/stories';
import IntentTabList from './IntentTabList';
import useStore from '../../../store/store';
import IntentDetails from './IntentDetails';

type Response = {
  name: string;
  text: string;
};

const Intents: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [intentResponseName, setIntentResponseName] = useState<string>('');
  const [intentResponseText, setIntentResponseText] = useState<string>('');

  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('');
  const [isMarkedForService, setIsMarkedForService] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState(false);

  const [editingIntentTitle, setEditingIntentTitle] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [intentRule, setIntentRule] = useState<string>('');

  const [deletableIntent, setDeletableIntent] = useState<Intent | null>(null);
  const [connectableIntent, setConnectableIntent] = useState<Intent | null>(null);
  const [turnIntentToServiceIntent, setTurnIntentToServiceIntent] = useState<Intent | null>(null);

  let intentParam: string | null = null;

  const { data: intentsFullResponse, isLoading } = useQuery({
    // queryKey: ['intents/full'],
    // todo is this broken VS base? http://localhost:3001/training/training/common-intents
    queryKey: ['intents/with-examples-count'],
  });

  // todo entities just likely pass as props?
  const { data: entitiesResponse } = useQuery<{ response: Entity[] }>({
    queryKey: ['entities'],
  });

  // const { data: responsesFullResponse } = useQuery({
  //   queryKey: ['responses-list'],
  // });

  // const { data: rulesFullResponse } = useQuery({
  //   queryKey: ['rules'],
  // });

  // console.log(intentsFullResponse);
  console.log('ENTITIES', entitiesResponse);
  // console.log(responsesFullResponse);
  // console.log(rulesFullResponse);

  let intentsFullList = intentsFullResponse?.response?.intents;
  let intents: Intent[] = [];

  // let intentResponsesFullList = responsesFullResponse ? responsesFullResponse[0].response : null;
  // let intentResponses: Response[] = [];

  // let rulesFullList = rulesFullResponse?.response;
  // let rules: Rule[] = [];

  if (intentsFullList) {
    intentsFullList.forEach((intent: any) => {
      // const countExamples = intent.examples.length;
      // todo types and simplify
      const newIntent: Intent = {
        id: intent.id,
        description: null,
        inModel: intent.inmodel,
        modifiedAt: intent.modifiedAt,
        examplesCount: intent.examples_count,
        examples: intent.examples,
        serviceId: intent.serviceId,
        isCommon: intent.id.startsWith('common_'),
      };
      intents.push(newIntent);
    });
    intentParam = searchParams.get('intent');
  }

  // if (intentResponsesFullList) {
  //   intentResponsesFullList?.forEach((response: any) => {
  //     const newIntentResponse: Response = {
  //       name: response.name,
  //       text: response.text,
  //     }
  //     intentResponses.push(newIntentResponse);
  //   });
  // }

  // if (rulesFullList) {
  //   rulesFullList.forEach((rule: any) => {
  //     rules.push(rule);
  //   });
  // }

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
              modifiedAt: newSelectedIntent.modifiedAt,
              examplesCount: newSelectedIntent.examples.length,
              examples: newSelectedIntent.examples,
              serviceId: newSelectedIntent.serviceId,
              isForService: newSelectedIntent.isForService,
            });
            setIsMarkedForService(newSelectedIntent.isForService ? newSelectedIntent.isForService : false);

            // queryClient.fetchQuery(['responses-list']).then((res: any) => {
            //   if (intentResponses.length > 0) {
            //     const intentExistingResponse = res[0].response.find((response: any) => `utter_${newSelectedIntent.title}` === response.name);
            //     if (intentExistingResponse) {
            //       setIntentResponseText(intentExistingResponse.text);
            //       setIntentResponseName(intentExistingResponse.name);
            //     }
            //   }
            // })

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
    [intents]
  );

  // todo below mostly ok and should likely stay in this component

  useEffect(() => {
    if (!intentParam || intentsFullList?.length !== intents?.length) return;

    const queryIntent = intents.find((intent) => intent.id === intentParam);

    if (queryIntent) {
      setSelectedIntent(queryIntent);
    }
  }, [intentParam]);

  const intentModifiedMutation = useMutation({
    mutationFn: (data: { intentName: string }) => getLastModified(data),
  });

  const turnIntentIntoServiceMutation = useMutation({
    mutationFn: ({ intent }: { intent: Intent }) => turnIntentIntoService(intent),
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

  const handleTabsValueChange = useCallback(
    (value: string) => {
      // setSelectedIntent(null);

      if (!intents) return;
      const selectedIntent = intents.find((intent) => intent.id === value);
      // if (selectedIntent) {
      //   // todo what is this? should only be run on actual intent change right?
      //   intentModifiedMutation.mutate(
      //     { intentName: selectedIntent.id },
      //     {
      //       onSuccess: (data) => {
      //         selectedIntent.modifiedAt = data.response;
      //         setSelectedIntent(selectedIntent);
      //       },
      //       onError: (error) => {
      //         selectedIntent.modifiedAt = '';
      //         setSelectedIntent(selectedIntent);
      //       },
      //     }
      //   );
      // }

      // todo below siumplified
      setSelectedIntent(selectedIntent!);
    },
    [intentModifiedMutation, intents]
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
      queryRefresh(filter.trim().replace(/\s+/g, '_'));
      setFilter('');
    },
  });

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
          <Tabs.List className="vertical-tabs__list" aria-label={t('training.intents.title') || ''}>
            <div className="vertical-tabs__list-search">
              <Track gap={8}>
                <FormInput
                  name="intentSearch"
                  label={t('training.intents.searchIntentPlaceholder')}
                  placeholder={t('training.intents.searchIntentPlaceholder') + '...' || ''}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  hideLabel
                />
                <Button onClick={() => newIntentMutation.mutate({ name: filter.trim() })} disabled={!filter}>
                  {t('global.add')}
                </Button>
              </Track>
            </div>

            <IntentTabList
              intents={intents}
              filter={filter}
              onDismiss={() => {
                if (!selectedIntent?.isCommon) return;
                setSelectedIntent(null);
              }}
            />
          </Tabs.List>

          {/* todo details here */}
          {selectedIntent && (
            <IntentDetails
              intentId={selectedIntent.id}
              setSelectedIntent={setSelectedIntent}
              entities={entitiesResponse?.response ?? []}
            />
          )}
        </Tabs.Root>
      )}

      {/* TODO: need to check if used at all */}
      {turnIntentToServiceIntent !== null && (
        <Dialog
          title={t('training.intents.turnIntoService')}
          onClose={() => setTurnIntentToServiceIntent(null)}
          footer={
            <>
              <Button appearance="secondary" onClick={() => setTurnIntentToServiceIntent(null)}>
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

export default withAuthorization(Intents, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
