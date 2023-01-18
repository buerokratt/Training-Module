import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button, Dialog, Icon, Tooltip, Track } from 'components';
import { TestStory } from 'types/testStory';
import { deleteTestStory } from 'services/testStories';
import { useToast } from 'hooks/useToast';
import { AxiosError } from 'axios';
import { MdCheckCircleOutline } from 'react-icons/md';

const Testcases: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestStory | null>(null);
  const [deletableTest, setDeletableTest] = useState<string | number | null>(null);
  const { data: testStories } = useQuery<TestStory[]>({
    queryKey: ['test-stories'],
  });

  const deleteTestMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteTestStory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['test-stories']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Test story deleted',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setDeletableTest(null),
  });

  const handleTabsValueChange = useCallback(
    (value: string) => {
      if (!testStories) return;
      const selectedStory = testStories.find((story) => story.story === value);
      if (selectedStory) {
        setSelectedTest(selectedStory);
        setSelectedTab(selectedStory.story);
      }
    },
    [testStories],
  );

  if (!testStories) return <>Loading...</>;

  return (
    <>
      <h1>{t('training.mba.testcases')}</h1>

      <Tabs.Root
        className='vertical-tabs'
        orientation='vertical'
        value={selectedTab ?? undefined}
        onValueChange={handleTabsValueChange}
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
                {story.hasTest && (
                  <Tooltip content={t('training.mba.testStoryExists')}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <Icon
                        icon={
                          <MdCheckCircleOutline
                            color={'rgba(0, 0, 0, 0.54)'}
                          />
                        }
                      />
                    </span>
                  </Tooltip>
                )}
              </Track>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {selectedTest && (
          <Tabs.Content
            key={selectedTest.story}
            className='vertical-tabs__body'
            value={selectedTest.story}
          >
            <div className='vertical-tabs__content-header'>
              <Track gap={16} justify='between'>
                <h3>{selectedTest.story}</h3>

                <Track gap={8}>
                  <Button appearance='secondary'>{t('global.add')}</Button>
                  <Button appearance='error'
                          onClick={() => setDeletableTest(selectedTest.id)}>{t('global.delete')}</Button>
                </Track>
              </Track>
            </div>
            <div className='vertical-tabs__content'>

            </div>
            <div className='vertical-tabs__content-footer'>
              <Button>{t('global.save')}</Button>
            </div>
          </Tabs.Content>
        )}
      </Tabs.Root>

      {deletableTest !== null && (
        <Dialog
          title={t('training.responses.deleteResponse')}
          onClose={() => setDeletableTest(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeletableTest(null)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => deleteTestMutation.mutate({ id: deletableTest })}
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

export default Testcases;
