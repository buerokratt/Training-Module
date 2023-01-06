import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import { useQuery } from '@tanstack/react-query';

import { Track } from 'components';
import { TestStory } from 'types/testStory';

const Testcases: FC = () => {
  const { t } = useTranslation();
  const { data: testStories } = useQuery<TestStory[]>({
    queryKey: ['test-stories'],
  });

  // const handleTabsValueChange = useCallback(
  //   (value: string) => {
  //     if (!intents) return;
  //     const selectedIntent = intents.find((intent) => intent.intent === value);
  //     if (selectedIntent) setSelectedIntent(selectedIntent);
  //   },
  //   [intents]
  // );

  if (!testStories) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.mba.testcases')}</h1>

      <Tabs.Root
        className='vertical-tabs'
        orientation='vertical'
        // onValueChange={handleTabsValueChange}
      >
        <Tabs.List
          className='vertical-tabs__list'
          aria-label={t('training.mba.testcases') || ''}
        >
          {testStories.map((story, index) => (
            <Tabs.Trigger
              key={`${story.story}-${index}`}
              className='vertical-tabs__trigger'
              value={story.story}
            >
              <Track gap={8}>
                <span style={{ flex: 1 }}>
                  {story.story}
                </span>
              </Track>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </>
  );
};

export default Testcases;
