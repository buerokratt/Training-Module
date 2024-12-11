import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { MdCheckCircleOutline } from 'react-icons/md';

import { Button, Card, Dialog, FormInput, Icon, Switch, Tooltip, Track } from 'components';
import { Intent } from 'types/intent';
import { Entity } from 'types/entity';
import { getLastModified } from 'services/intents';
import LoadingDialog from '../../../components/LoadingDialog';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import IntentDetails from './IntentDetails';

const CommonIntents: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [commonIntentsEnabled, setCommonIntentsEnabled] = useState(true);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
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

    const queryIntent = commonIntents.find((intent) => intent.id === intentParam);

    if (queryIntent) {
      setSelectedIntent(queryIntent);
    }
  }, [intentParam]);

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

  const filteredIntents = useMemo(() => {
    if (!commonIntents) return [];
    const formattedFilter = filter.trim().replace(/\s+/g, '_');
    return commonIntents
      .filter((intent) => intent.id?.includes(formattedFilter))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [commonIntents, filter]);

  const intentModifiedMutation = useMutation({
    mutationFn: (data: { intentName: string }) => getLastModified(data),
  });

  const handleTabsValueChange = useCallback(
    (value: string) => {
      setSelectedIntent(null);
      if (!commonIntents) return;
      const selectedIntent = commonIntents.find((intent) => intent.id === value);
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
              {/* todo new bug */}
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
              </Track>
            </div>

            <div className="vertical-tabs__list-scrollable">
              {filteredIntents.map((intent, index) => (
                <Tabs.Trigger key={`${intent}-${index}`} className="vertical-tabs__trigger" value={intent.id}>
                  <Track gap={16}>
                    <span style={{ flex: 1 }}>{intent.id.replace(/^common_/, '').replace(/_/g, ' ')}</span>
                    <Tooltip content={t('training.intents.amountOfExamples')}>
                      <span style={{ color: '#5D6071' }}>{intent.examplesCount}</span>
                    </Tooltip>
                    {intent.inModel ? (
                      <Tooltip content={t('training.intents.intentInModel')}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <Icon
                            icon={
                              <MdCheckCircleOutline color={'rgba(0, 0, 0, 0.54)'} opacity={intent.inModel ? 1 : 0} />
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
            </div>
          </Tabs.List>

          {selectedIntent && (
            <IntentDetails
              intentId={selectedIntent.id}
              // todo types
              setSelectedIntent={setSelectedIntent}
              listRefresh={queryRefresh}
            />
          )}
        </Tabs.Root>
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
