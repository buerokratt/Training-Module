import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';

import { Button, DataTable, FormInput, Icon, Track } from 'components';
import {Rule, Rules} from 'types/rule';
import {Stories as StoriesType, Story} from 'types/story';

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
  const rules = useMemo(() => rulesResponse ? rulesResponse.response.map((r, i) => ({
    id: r.id,
    rule: r.id
  })) : [], [rulesResponse]);
  const stories = useMemo(() => storiesResponse ? storiesResponse.response.map((r, i) => ({
    id: r.id,
    rule: r.id
  })) : [], [storiesResponse]);
  const storiesColumnHelper = createColumnHelper<Story>();
  const rulesColumnHelper = createColumnHelper<Rule>();

  const storiesColumns = useMemo(() => [
    storiesColumnHelper.accessor('id', {
      header: 'Story',
    }),
    storiesColumnHelper.display({
      header: '',
      cell: (props) => (
        <Button
          appearance='text'
          onClick={() => navigate(`${props.row.original.id}`)}
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
        <Button appearance='text'>
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
          onClick={() => navigate(`reeglid/${props.row.original.id}`)}
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
        <Button appearance='text'>
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
              <Button onClick={() => navigate('/training/stories/new', { state: { storyTitle: filter } })}>{t('global.add')}</Button>
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
              <Button>{t('global.add')}</Button>
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
    </>
  );
};

export default Stories;
