import {FC, useEffect, useMemo, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import {useMutation, useQuery} from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';

import {Button, DataTable, Dialog, FormInput, Icon, Track} from 'components';
import {Rule, Rules} from 'types/rule';
import {Stories as StoriesType, Story} from 'types/story';
import {deleteStoryOrRule} from "../../../services/stories";
import {AxiosError} from "axios";
import LoadingDialog from "../../../components/LoadingDialog";
import { useToast } from 'hooks/useToast';


const Stories: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: storiesResponse } = useQuery<StoriesType>({
    queryKey: ['stories'],
  });
  const { data: rulesResponse } = useQuery<Rules>({
    queryKey: ['rules'],
  });
  const [selectedTab, setSelectedTab] = useState<string>('stories');
  const [filter, setFilter] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const [rules, setRules] = useState<Rules[]>([]);
  const storiesColumnHelper = createColumnHelper<Story>();
  const rulesColumnHelper = createColumnHelper<Rule>();
  const toast = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');

  useEffect(() => {
    if (selectedTab === 'stories' && storiesResponse) {
      setStories(storiesResponse.response.map((r) => ({
        id: r.id,
        story: r.id
      })));
    } else if (selectedTab === 'rules' && rulesResponse) {
      setRules(rulesResponse.response.map((r) => ({
        id: r.id,
        rule: r.id
      })));
    } else {
      setStories([]);
      setRules([]);
    }
  }, [rulesResponse, selectedTab, storiesResponse]);

  const handleDelete = (id: string) => {
    setDeleteConfirmation(true);
    setDeleteId(id);
  };

  const storiesColumns = useMemo(() => [
    storiesColumnHelper.accessor('id', {
      header: 'Story',
    }),
    storiesColumnHelper.display({
      header: '',
      cell: (props) => (
        <Button
          appearance='text'
          onClick={() => navigate(`${props.row.original.id}`, { state: { storyTitle: filter, category: 'stories' } })}
        >
          <Icon
            label={t('global.edit')}
            icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />}
          />
          {t('global.edit')}
        </Button>
      ),
      id: 'edit',
      meta: {
        size: '1%',
      },
    }),
    storiesColumnHelper.display({
      header: '',
      cell: (props) => (
        <Button appearance='text'
                onClick={() => handleDelete(props.row.original.id)}
        >
          <Icon
            label={t('global.delete')}
            icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />}
          />
          {t('global.delete')}
        </Button>
      ),
      id: 'delete',
      meta: {
        size: '1%',
      },
    }),
  ], [navigate, storiesColumnHelper, t]);

  const rulesColumns = useMemo(() => [
    rulesColumnHelper.accessor('id', {
      header: 'Rule',
    }),
    rulesColumnHelper.display({
      header: '',
      cell: (props) => (
        <Button
          appearance='text'
          onClick={() => navigate(`rules/${props.row.original.id}`, { state: { category: 'rules' } })}
        >
          <Icon
            label={t('global.edit')}
            icon={<MdOutlineModeEditOutline color={'rgba(0,0,0,0.54)'} />}
          />
          {t('global.edit')}
        </Button>
      ),
      id: 'edit',
      meta: {
        size: '1%',
      },
    }),
    rulesColumnHelper.display({
      header: '',
      cell: (props) => (
        <Button
            appearance='text'
            onClick={() => handleDelete(props.row.original.id)}
        >
          <Icon
              label={t('global.delete')}
              icon={<MdDeleteOutline color={'rgba(0,0,0,0.54)'} />}
          />
          {t('global.delete')}
        </Button>
      ),
      id: 'delete',
      meta: {
        size: '1%',
      },
    }),
  ], [navigate, rulesColumnHelper, t]);

  const handleTabChange = (value: string) => {
    setFilter('');
    setSelectedTab(value);
  };

  const deleteStoryMutation = useMutation({
    mutationFn: ({ id, category }: { id: string, category: string }) => deleteStoryOrRule(id, category),
    onMutate: () => setRefreshing(true),
    onSuccess: async () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Story deleted',
      });
      if (selectedTab === 'stories') {
        setStories(stories.filter(story => story.id !== deleteId));
      } else {
        setRules(rules.filter(rule => rule.id !== deleteId));
      }
      navigate(import.meta.env.BASE_URL + 'stories');
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => {
      setRefreshing(false)
    },
  });

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

        <Tabs.Content className='vertical-tabs__body' value='stories'>
          <div className='vertical-tabs__content-header'>
            <Track gap={16}>
              <FormInput
                label={t('global.search')}
                name='search'
                placeholder={t('global.search') + '...'}
                hideLabel
                onChange={(e) => setFilter(e.target.value)}
              />
              <Button onClick={() => navigate('/training/stories/new', { state: { id: filter, category: 'stories' } })}>
                {t('global.add')}
              </Button>
            </Track>
          </div>
          <div className='vertical-tabs__content'>
            {stories && (
              <DataTable
                data={stories}
                columns={storiesColumns}
                globalFilter={filter}
                setGlobalFilter={setFilter}
              />
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content className='vertical-tabs__body' value='rules'>
          <div className='vertical-tabs__content-header'>
            <Track gap={16}>
              <FormInput
                label={t('global.search')}
                name='search'
                placeholder={t('global.search') + '...'}
                hideLabel
                onChange={(e) => setFilter(e.target.value)}
              />
              <Button onClick={() => navigate('/training/rules/new', { state: { id: filter, category: 'rules' } })}>
                {t('global.add')}
              </Button>
            </Track>
          </div>
          <div className='vertical-tabs__content'>
            {rules && (
              <DataTable
                data={rules}
                columns={rulesColumns}
                globalFilter={filter}
                setGlobalFilter={setFilter}
              />
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {deleteId && deleteConfirmation && (
          <Dialog
              title={t('training.responses.deleteStory')}
              onClose={() => setDeleteConfirmation(false)}
              footer={
                <>
                  <Button appearance='secondary' onClick={() => setDeleteConfirmation(false)}>{t('global.no')}</Button>
                  <Button
                      appearance='error'
                      onClick={() => {
                        deleteStoryMutation.mutate({ id: deleteId, category: selectedTab });
                        setDeleteConfirmation(false);
                      }
                    }
                  >
                    {t('global.yes')}
                  </Button>
                </>
              }
          >
            <p>{t('global.removeValidation')}</p>
          </Dialog>
      )}

      {refreshing && (
          <LoadingDialog title={t('global.updatingDataHead')} >
            <p>{t('global.updatingDataBody')}</p>
          </LoadingDialog>
      )}
    </>
  );
};

export default Stories;
