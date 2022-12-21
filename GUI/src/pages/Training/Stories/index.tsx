import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';

import { Button, FormInput, Track } from 'components';

const Stories: FC = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<string>('stories');
  const [filter, setFilter] = useState('');

  const handleTabChange = (value: string) => {
    setFilter('');
    setSelectedTab(value);
  };

  return (
    <>
      <h1>{t('training.stories.title')}</h1>

      <Tabs.Root
        className='vertical-tabs'
        orientation='vertical'
        onValueChange={(value) => handleTabChange(value)}
        defaultValue={selectedTab}
      >
        <Tabs.List className='vertical-tabs__list' aria-label={t('training.stories.title') || ''}>
          <Tabs.Trigger className='vertical-tabs__trigger' value='stories'>
            {t('training.stories.stories')}
          </Tabs.Trigger>
          <Tabs.Trigger className='vertical-tabs__trigger' value='rules'>
            {t('training.stories.rules')}
          </Tabs.Trigger>
        </Tabs.List>

        {selectedTab && (
          <Tabs.Content key={selectedTab} className='vertical-tabs__body' value={selectedTab}>
            <div className='vertical-tabs__content-header'>
              <Track gap={16}>
                <FormInput label='search' name='search' placeholder={t('global.search') + '...'} hideLabel />
                <Button>{t('global.add')}</Button>
              </Track>
            </div>
            <div className='verttical-tabs__content'>

            </div>
          </Tabs.Content>
        )}
      </Tabs.Root>
    </>
  );
};

export default Stories;
