import { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import {
  MdCheckCircleOutline,
  MdOutlineModeEditOutline,
  MdOutlineSave,
} from 'react-icons/md';

import { Button, FormInput, Icon, Tooltip, Track } from 'components';
import useDocumentEscapeListener from 'hooks/useDocumentEscapeListener';
import { Intent } from 'types/intent';
import IntentExamplesTable from './IntentExamplesTable';

const Training: FC = () => {
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['common-intents'],
  });
  const { data: examples } = useQuery<string[]>({
    queryKey: [`common-intents/${selectedIntent?.id}/examples`, selectedIntent?.id],
    enabled: !!selectedIntent,
  });
  const [filter, setFilter] = useState('');
  const [editingIntentTitle, setEditingIntentTitle] = useState<string | null>(null);
  const { t } = useTranslation();

  useDocumentEscapeListener(() => setEditingIntentTitle(null));

  const filteredIntents = useMemo(() => intents ? intents.filter((intent) => intent.intent.includes(filter)) : [], [intents, filter]);

  const handleTabsValueChange = useCallback((value: string) => {
    if (!intents) return;
    const selectedIntent = intents.find((intent) => intent.intent === value);
    if (selectedIntent) setSelectedIntent(selectedIntent);
  }, [intents]);

  if (!intents) return <>Loading...</>;

  const handleNewExample = (example: string) => {
    // TODO: Add endpoint for mocking adding examples
  };

  const handleIntentTitleSave = () => {
    // TODO: Add endpoint for mocking intent title change
  };

  const handleRemoveIntentFromModel = () => {
    // TODO: Add endpoint for mocking intent removal from model
  };

  const handleIntentDelete = () => {
    // TODO: Add endpoint for mocking deleting intent
  };

  return (
    <>
      <h1 className='h3'>{t('training.intents.commonIntents')}</h1>
      {intents && (
        <Tabs.Root
          className='vertical-tabs'
          orientation='vertical'
          onValueChange={handleTabsValueChange}
        >
          <Tabs.List className='vertical-tabs__list' aria-label={t('training.intents.title') ?? ''}>
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
                <Button>{t('global.add')}</Button>
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
                <Track justify='between' gap={16}>
                  <Track direction='vertical' align='left' gap={4}>
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
                        <Button appearance='text' onClick={handleIntentTitleSave}>
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
                    {selectedIntent.description && <p>{selectedIntent.description}</p>}
                  </Track>
                  <Track direction='vertical' align='right' gap={16}>
                    <p>{`${t('global.modifiedAt')} ${format(new Date(selectedIntent.modifiedAt), 'dd.MM.yyyy')}`}</p>
                    <Track gap={8}>
                      {selectedIntent.inModel ? (
                        <Button
                          appearance='secondary'
                          onClick={handleRemoveIntentFromModel}
                        >
                          {t('training.intents.removeFromModel')}
                        </Button>
                      ) : (
                        <Button onClick={handleIntentDelete}>{t('training.intents.addToModel')}</Button>
                      )}
                      <Button appearance='error'>{t('global.delete')}</Button>
                    </Track>
                  </Track>
                </Track>
              </div>
              <div className='vertical-tabs__content'>
                {examples && <IntentExamplesTable examples={examples} onAddNewExample={handleNewExample} />}
              </div>
            </Tabs.Content>
          )}
        </Tabs.Root>
      )}
    </>
  );
};

export default Training;
