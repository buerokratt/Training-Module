import { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import {
  MdCheckCircleOutline,
  MdOutlineModeEditOutline,
  MdOutlineSave,
} from 'react-icons/md';

import { Button, FormInput, Icon, Tooltip, Track } from 'components';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { useToast } from 'hooks/useToast';
import { Intent } from 'types/intent';
import { Entity } from 'types/entity';
import { addExample } from 'services/intents';
import IntentExamplesTable from './IntentExamplesTable';

const CommonIntents: FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });
  const { data: examples } = useQuery<string[]>({
    queryKey: [`intents/${selectedIntent?.id}/examples`, selectedIntent?.id],
    enabled: !!selectedIntent,
  });
  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });
  const [filter, setFilter] = useState('');
  const [editingIntentTitle, setEditingIntentTitle] = useState<string | null>(null);
  const { t } = useTranslation();

  const addExamplesMutation = useMutation({
    mutationFn: ({ intentId, example }: { intentId: string | number; example: string }) => {
      return addExample(intentId, { example });
    },
    onSuccess: (data) => {
      if (selectedIntent) {
        queryClient.invalidateQueries({ queryKey: [`intents/${selectedIntent.id}/examples`] });
      }
      // TODO: Add correct notification on successful example
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Message',
      });
    },
  });

  useDocumentEscapeListener(() => setEditingIntentTitle(null));

  const filteredIntents = useMemo(() => intents ? intents.filter((intent) => intent.intent.includes(filter)) : [], [intents, filter]);

  const handleTabsValueChange = useCallback((value: string) => {
    if (!intents) return;
    const selectedIntent = intents.find((intent) => intent.intent === value);
    if (selectedIntent) setSelectedIntent(selectedIntent);
  }, [intents]);

  if (!intents) return <>Loading...</>;

  const handleNewExample = (example: string) => {
    if (!selectedIntent) return;
    addExamplesMutation.mutate({ intentId: selectedIntent.id, example });
  };

  const handleIntentTitleSave = (intentId: string | number) => {
    // TODO: Add endpoint for mocking intent title change
  };

  const handleRemoveIntentFromModel = (intentId: string | number) => {
    // TODO: Add endpoint for mocking intent removal from model
  };

  const handleIntentCreate = () => {
    // TODO: Add endpoint for mocking adding intent
  };

  const handleIntentDelete = (intentId: string | number) => {
    // TODO: Add endpoint for mocking deleting intent
  };

  const handleIntentExamplesUpload = (intentId: string | number) => {
    // TODO: Add endpoint for mocking intent examples file upload
  };

  const handleIntentExamplesDownload = (intentId: string | number) => {
    // TODO: Add endpoint for mocking intent examples download
  };

  return (
    <>
      <h1>{t('training.intents.title')}</h1>
      {intents && (
        <Tabs.Root
          className='vertical-tabs'
          orientation='vertical'
          onValueChange={handleTabsValueChange}
        >
          <Tabs.List className='vertical-tabs__list' aria-label={t('training.intents.title') || ''}>
            <div className='vertical-tabs__list-search'>
              <Track gap={8}>
                <FormInput
                  name='intentSearch'
                  label={t('training.intents.searchIntentPlaceholder')}
                  placeholder={t('training.intents.searchIntentPlaceholder') + '...' || ''}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  hideLabel
                />
                <Button onClick={handleIntentCreate} disabled={!filter}>{t('global.add')}</Button>
              </Track>
            </div>

            {filteredIntents.map((intent, index) => (
              <Tabs.Trigger key={`${intent}-${index}`} className='vertical-tabs__trigger' value={intent.intent}>
                <Track gap={16}>
                  <span style={{ flex: 1 }}>{intent.intent.replace(/^common_/, '')}</span>
                  <Tooltip content={t('training.intents.amountOfExamples')}>
                    <span style={{ color: '#5D6071' }}>{intent.examplesCount}</span>
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
            <Tabs.Content key={selectedIntent.intent} className='vertical-tabs__body' value={selectedIntent.intent}>
              <div className='vertical-tabs__content-header'>
                <Track direction='vertical' align='stretch' gap={8}>
                  <Track justify='between'>
                    <Track gap={16}>
                      {editingIntentTitle ? (
                        <FormInput
                          label='Intent title'
                          name='intentTitle'
                          value={editingIntentTitle}
                          onChange={(e) => setEditingIntentTitle(e.target.value)}
                          hideLabel
                        />
                      ) : (
                        <h3>{selectedIntent.intent.replace(/^common_/, '')}</h3>
                      )}
                      {editingIntentTitle ? (
                        <Button appearance='text' onClick={() => handleIntentTitleSave(selectedIntent.id)}>
                          <Icon icon={<MdOutlineSave />} />
                          {t('global.save')}
                        </Button>
                      ) : (
                        <Button appearance='text' onClick={() => setEditingIntentTitle(selectedIntent.intent)}>
                          <Icon icon={<MdOutlineModeEditOutline />} />
                          {t('global.edit')}
                        </Button>
                      )}
                    </Track>
                    <p style={{ color: '#4D4F5D' }}>
                      {`${t('global.modifiedAt')} ${format(new Date(selectedIntent.modifiedAt), 'dd.MM.yyyy')}`}
                    </p>
                  </Track>
                  <Track justify='end' gap={8}>
                    <Button appearance='secondary'
                            onClick={() => handleIntentExamplesUpload(selectedIntent.id)}>{t('training.intents.upload')}</Button>
                    <Button appearance='secondary'
                            onClick={() => handleIntentExamplesDownload(selectedIntent.id)}>{t('training.intents.download')}</Button>
                    {selectedIntent.inModel ? (
                      <Button
                        appearance='secondary'
                        onClick={() => handleRemoveIntentFromModel(selectedIntent.id)}
                      >
                        {t('training.intents.removeFromModel')}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleIntentDelete(selectedIntent.id)}>{t('training.intents.addToModel')}</Button>
                    )}
                    <Button appearance='error'>{t('global.delete')}</Button>
                  </Track>
                </Track>
              </div>
              <div className='vertical-tabs__content'>
                {examples &&
                  <IntentExamplesTable
                    examples={examples}
                    onAddNewExample={handleNewExample}
                    entities={entities ?? []}
                  />
                }
              </div>
            </Tabs.Content>
          )}
        </Tabs.Root>
      )}
    </>
  );
};

export default CommonIntents;
