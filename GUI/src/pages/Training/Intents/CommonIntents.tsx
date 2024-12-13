import { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';

import { Card, FormInput, Switch, Track } from 'components';
import { getLastModified } from 'services/intents';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import IntentDetails from './IntentDetails';

import { useIntentsData } from './useIntentsData';
import IntentList from './IntentList';

const CommonIntents: FC = () => {
  const { t } = useTranslation();

  const { intents, selectedIntent, setSelectedIntent, queryRefresh, isLoading } = useIntentsData({
    queryKey: 'intents/with-examples-count?prefix=common_',
  });

  const [commonIntentsEnabled, setCommonIntentsEnabled] = useState(true);
  const [filter, setFilter] = useState('');

  const filteredIntents = useMemo(() => {
    if (!intents) return [];
    const formattedFilter = filter.trim().replace(/\s+/g, '_');
    return intents.filter((intent) => intent.id?.includes(formattedFilter)).sort((a, b) => a.id.localeCompare(b.id));
  }, [intents, filter]);

  const intentModifiedMutation = useMutation({
    mutationFn: (data: { intentName: string }) => getLastModified(data),
  });

  const handleTabsValueChange = useCallback(
    (value: string) => {
      setSelectedIntent(null);
      if (!intents) return;
      const selectedIntent = intents.find((intent) => intent.id === value);
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
    [intentModifiedMutation, intents, queryRefresh, setSelectedIntent]
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

      {commonIntentsEnabled && intents && (
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
              <IntentList intents={filteredIntents} />
            </div>
          </Tabs.List>

          {selectedIntent && (
            <IntentDetails
              intentId={selectedIntent.id}
              setSelectedIntent={setSelectedIntent}
              listRefresh={queryRefresh}
            />
          )}
        </Tabs.Root>
      )}
    </>
  );
};

export default withAuthorization(CommonIntents, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
