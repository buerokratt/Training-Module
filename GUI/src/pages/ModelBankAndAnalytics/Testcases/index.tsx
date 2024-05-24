import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { MdCheckCircleOutline } from 'react-icons/md';

import { Button, Dialog, FormSelect, Icon, Tooltip, Track } from 'components';
import { TestStory } from 'types/testStory';
import { deleteTestStory } from 'services/testStories';
import { useToast } from 'hooks/useToast';
import withAuthorization, { ROLES } from 'hoc/with-authorization';

const Testcases: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestStory | null>(null);
  const [deletableTest, setDeletableTest] = useState<string | number | null>(null);
  const [showAddTest, setShowAddTest] = useState(false);
  const { data: testStories } = useQuery<TestStory[]>({
    queryKey: ['test-stories'],
  });
  const { data: examples } = useQuery<string[]>({
    queryKey: ['examples'],
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
        setShowAddTest(false);
      }
    },
    [testStories],
  );

  const handleTestSave = () => {

  }

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
                {story.activeStory && (<span style={{color: 'rgba(0, 0, 0, 0.54'}}>STORY</span>)}
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
                  {!selectedTest.activeStory &&
                  <Button appearance='secondary' onClick={() => setShowAddTest(true)}>{t('global.add')}</Button>
                  }
                  <Button appearance='error'
                          onClick={() => setDeletableTest(selectedTest.id)}>{t('global.delete')}</Button>
                </Track>
              </Track>
            </div>
            {showAddTest && (
              <>
              <div className='vertical-tabs__content'>
              <Track direction='vertical' align='left' gap={8}>
                <Track gap={16} style={{ width: '100%' }}>
                  <p style={{ flex: 1 }}>intent</p>
                  <p style={{ flex: 1 }}>{selectedTest.steps.intent}</p>
                  <div style={{ flex: 2 }}>
                    <FormSelect
                      name='userResponse'
                      label={t('training.mba.userResponse')}
                      hideLabel
                      options={examples?.map((e) => ({ label: e, value: e })) || []}
                    />
                  </div>
                </Track>
                <Track gap={16} style={{ width: '100%' }}>
                  <p style={{ flex: 1 }}>action</p>
                  <p style={{ flex: 1 }}>{selectedTest.steps.action}</p>
                  <p style={{ flex: 2 }}></p>
                </Track>
              </Track>
            </div>
            <div className='vertical-tabs__content-footer'>
              <Button onClick={handleTestSave}>{t('global.save')}</Button>
            </div>
            </>
            )}

            { selectedTest.activeStory && (
              <>
              <div className='vertical-tabs__content'>
              <Track direction='vertical' align='left' gap={8}>
                <Track gap={16} style={{ width: '100%' }}>
                  <p style={{ flex: 1 }}>intent</p>
                  <p style={{ flex: 1 }}>{selectedTest.steps.intent}</p>
                  <div style={{ flex: 2 }}>
                    <FormSelect
                      name='userResponse'
                      label={t('training.mba.userResponse')}
                      hideLabel
                      options={examples?.map((e) => ({ label: e, value: e })) || []}
                    />
                  </div>
                </Track>
                <Track gap={16} style={{ width: '100%' }}>
                  <p style={{ flex: 1 }}>action</p>
                  <p style={{ flex: 1 }}>{selectedTest.steps.action}</p>
                  <p style={{ flex: 2 }}></p>
                </Track>
              </Track>
            </div>
            <div className='vertical-tabs__content-footer'>
              <Button onClick={handleTestSave}>{t('global.save')}</Button>
            </div>
              </>
            )}
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

export default withAuthorization(Testcases, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
