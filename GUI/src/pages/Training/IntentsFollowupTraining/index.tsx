import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import { useSearchParams } from 'react-router-dom';

import Entities from './Entities';
import Regex from './Regex';

const IntentsFollowupTraining: FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  useEffect(() => {
    const queryTab = searchParams.get('tab');
    if (queryTab) {
      setSelectedTab(queryTab);
    }
  }, [searchParams]);

  return (
    <>
      <h1>{t('training.intents.followupTraining')}</h1>

      <Tabs.Root
        className='vertical-tabs'
        orientation='vertical'
        value={selectedTab ?? undefined}
        onValueChange={setSelectedTab}
      >
        <Tabs.List
          className='vertical-tabs__list'
          aria-label={t('training.intents.followupTraining') || ''}
        >
          {[
            { label: t('training.intents.entities'), value: 'entities' },
            { label: t('training.intents.regex'), value: 'regex' },
          ].map((tab, index) => (
            <Tabs.Trigger key={`${tab.value}-${index}`} value={tab.value} className='vertical-tabs__trigger'>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content key='entities' value='entities' className='vertical-tabs__body'>
          <Entities />
        </Tabs.Content>

        <Tabs.Content key='regex' value='regex' className='vertical-tabs__body'>
          <Regex />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default IntentsFollowupTraining;
