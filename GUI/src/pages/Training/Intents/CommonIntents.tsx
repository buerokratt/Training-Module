import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import { MdCheckCircleOutline } from 'react-icons/md';

import { Button, Card, Dialog, FormInput, Icon, Switch, Tooltip, Track } from 'components';
import { useToast } from 'hooks/useToast';
import { Intent } from 'types/intent';
import { Entity } from 'types/entity';
import { addExample, deleteIntent, editIntent } from 'services/intents';
import IntentExamplesTable from './IntentExamplesTable';

const CommonIntents: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [commonIntentsEnabled, setCommonIntentsEnabled] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [deletableIntent, setDeletableIntent] = useState<string | number | null>(null);
  const [filter, setFilter] = useState('');
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
    enabled: commonIntentsEnabled,
  });
  const { data: examples } = useQuery<string[]>({
    queryKey: [`intents/${selectedIntent?.id}/examples`, selectedIntent?.id],
    enabled: !!selectedIntent,
  });
  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });

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

  const intentModelMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: { inModel: boolean } }) => editIntent(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['intents']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Intent updated',
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

  const filteredIntents = useMemo(
    () =>
      intents ? intents.filter((intent) => intent.intent.includes(filter)) : [],
    [intents, filter],
  );

  const handleTabsValueChange = useCallback(
    (value: string) => {
      if (!intents) return;
      const selectedIntent = intents.find((intent) => intent.intent === value);
      if (selectedIntent) {
        setSelectedIntent(selectedIntent);
        setSelectedTab(selectedIntent.intent);
      }
    },
    [intents],
  );

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
      <h1>{t('training.intents.commonIntents')}</h1>

      <Card>
        <Track gap={16}>
          <div style={{ minWidth: 187 }}>
            <p>{t('training.intents.commonIntents')}</p>
            <p style={{
              fontSize: 14,
              lineHeight: 1.5,
              textDecoration: 'underline',
            }}>
              {/* TODO: change githubi link url */}
              <a href='#'>{t('training.intents.moreFromGithub')}</a>
            </p>
          </div>
          <Switch
            label={t('training.intents.commonIntents')}
            hideLabel
            name='commonIntents'
            checked={commonIntentsEnabled}
            onCheckedChange={setCommonIntentsEnabled}
          />
        </Track>
      </Card>

      {commonIntentsEnabled && intents && (
        <Tabs.Root
          id="tabs"
          className='vertical-tabs'
          orientation='vertical'
          value={selectedTab ?? undefined}
          onValueChange={handleTabsValueChange}
        >
          <Tabs.List
            className='vertical-tabs__list'
            aria-label={t('training.intents.title') || ''}
          >
            <div className='vertical-tabs__list-search'>
              <Track gap={8}>
                <FormInput
                  name='intentSearch'
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

            {filteredIntents.map((intent, index) => (
              <Tabs.Trigger
                key={`${intent}-${index}`}
                className='vertical-tabs__trigger'
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
              className='vertical-tabs__body'
              value={selectedIntent.intent}
            >
              <div className='vertical-tabs__content-header'>
                <Track direction='vertical' align='stretch' gap={8}>
                  <Track justify='between'>
                    <Track gap={16}>
                      <h3>{selectedIntent.intent}</h3>
                    </Track>
                    <p style={{ color: '#4D4F5D' }}>
                      {`${t('global.modifiedAt')} ${format(
                        new Date(selectedIntent.modifiedAt),
                        'dd.MM.yyyy',
                      )}`}
                    </p>
                  </Track>
                  <Track justify='end' gap={8}>
                    <Button
                      appearance='secondary'
                      onClick={() =>
                        handleIntentExamplesUpload(selectedIntent.id)
                      }
                    >
                      {t('training.intents.upload')}
                    </Button>
                    <Button
                      appearance='secondary'
                      onClick={() =>
                        handleIntentExamplesDownload(selectedIntent.id)
                      }
                    >
                      {t('training.intents.download')}
                    </Button>
                    {selectedIntent.inModel ? (
                      <Button
                        appearance='secondary'
                        onClick={() =>
                          intentModelMutation.mutate({ id: selectedIntent.id, data: { inModel: false } })
                        }
                      >
                        {t('training.intents.removeFromModel')}
                      </Button>
                    ) : (
                      <Button onClick={() =>
                        intentModelMutation.mutate({ id: selectedIntent.id, data: { inModel: true } })
                      }>
                        {t('training.intents.addToModel')}
                      </Button>
                    )}
                    <Button
                      appearance='error'
                      onClick={() => setDeletableIntent(selectedIntent.id)}
                    >
                      {t('global.delete')}
                    </Button>
                  </Track>
                </Track>
              </div>
              <div className='vertical-tabs__content'>
                {examples && (
                  <IntentExamplesTable
                    examples={examples}
                    onAddNewExample={handleNewExample}
                    entities={entities ?? []}
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
              <Button appearance='secondary' onClick={() => setDeletableIntent(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => deleteIntentMutation.mutate({ id: deletableIntent })}
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

export default CommonIntents;
