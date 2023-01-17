import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineArrowBack } from 'react-icons/md';

import { Button, FormSelect, Track } from 'components';
import { ResultBundle } from 'types/result';

const ModelsDetail: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedBundle, setSelectedBundle] = useState<ResultBundle | null>(null);
  const { data: resultsData } = useQuery<ResultBundle[]>({
    queryKey: [`results/${params.id}`],
    enabled: !!params.id,
  });

  if (!resultsData) return <>Loading...</>;

  return (
    <>
      <Track gap={16}>
        <Button appearance='icon' onClick={() => navigate('/treening/mudelipank-ja-analuutika/mudelite-vordlus')}>
          <MdOutlineArrowBack />
        </Button>
        <h1>{t('training.mba.modelResults')}</h1>
      </Track>

      <Tabs.Root
        className='vertical-tabs'
        orientation='vertical'
        onValueChange={(value) => setSelectedBundle(resultsData.find((bundle) => bundle.name === value) || null)}
      >
        <Tabs.List
          className='vertical-tabs__list'
          aria-label={t('training.mba.modelResults') || ''}
        >
          {resultsData.map((bundle, index) => (
            <Tabs.Trigger
              key={`${bundle.name}-${index}`}
              className='vertical-tabs__trigger'
              value={bundle.name}
            >
              {bundle.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {selectedBundle && (
          <Tabs.Content
            key={selectedBundle.name}
            className='vertical-tabs__body'
            value={selectedBundle.name}
          >
            <div className='vertical-tabs__content-header'>
              <FormSelect
                label={t('training.mba.file')}
                name='files'
                hideLabel
                options={selectedBundle.files.map((file) => ({
                  label: file.fileName,
                  value: file.fileName,
                }))}
              />
            </div>
            <div className='vertical-tabs__content' style={{ padding: 0 }}>
              <Track align='stretch'>
                <div style={{ flex: 1, borderRight: '1px solid #D2D3D8' }}>
                </div>
                <div style={{ flex: 1 }}>
                </div>
              </Track>
            </div>
          </Tabs.Content>
        )}
      </Tabs.Root>
    </>
  );
};

export default ModelsDetail;
