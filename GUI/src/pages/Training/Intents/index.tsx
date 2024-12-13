import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { AxiosError } from 'axios';

import { Button, FormInput, Track } from 'components';
import { useToast } from 'hooks/useToast';
import { addIntent } from 'services/intents';
import LoadingDialog from '../../../components/LoadingDialog';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import IntentTabList from './IntentTabList';
import IntentDetails from './IntentDetails';
import { useIntentsData } from './useIntentsData';

const Intents: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const { intents, selectedIntent, setSelectedIntent, queryRefresh, isLoading } = useIntentsData({
    queryKey: 'intents/with-examples-count',
  });

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('');

  const handleTabsValueChange = useCallback(
    (value: string) => {
      const selectedIntent = intents.find((intent) => intent.id === value);
      setSelectedIntent(selectedIntent!);
    },
    [intents, setSelectedIntent]
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

          {selectedIntent && (
            <IntentDetails
              intentId={selectedIntent.id}
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

export default withAuthorization(Intents, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
