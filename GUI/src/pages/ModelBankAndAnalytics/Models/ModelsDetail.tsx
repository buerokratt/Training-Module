import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineArrowBack, MdOutlineSettingsInputAntenna } from 'react-icons/md';

import { Button, Card, FormSelect, Icon, Track } from 'components';
import { ResultBundle, ResultFile } from 'types/result';
import { format } from 'date-fns';
import { Model } from 'types/model';

const ModelsDetail: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedBundle, setSelectedBundle] = useState<ResultBundle | null>(null);
  const [selectedFile, setSelectedFile] = useState<ResultFile | null>(null);
  const { data: resultsData } = useQuery<ResultBundle[]>({
    queryKey: [`results/${params.id}`],
    enabled: !!params.id,
  });
  const { data: models } = useQuery<Model[]>({
    queryKey: ['models'],
  });
  const activeModel = useMemo(() => {
    return models?.find((model) => model.state === 'DEPLOYED')
  }, [models])

  if (!resultsData) return <>Loading...</>;

  return (
    <>
      <Track gap={16}>
        <Button appearance='icon' onClick={() => navigate('/analytics/models')}>
          <MdOutlineArrowBack />
        </Button>
        <h1>{t('training.mba.modelResults')}</h1>
      </Track>

      <Tabs.Root
        className='vertical-tabs'
        orientation='vertical'
        onValueChange={(value) => {
          setSelectedBundle(resultsData.find((bundle) => bundle.name === value) || null);
          setSelectedFile(null);
        }}
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
                  value: file.fileUri,
                }))}
                onSelectionChange={(selection) => setSelectedFile(selectedBundle?.files.find((f) => f.fileUri === selection?.value) || null)}
              />
            </div>
            <div className='vertical-tabs__content' style={{ padding: 0 }}>
              <Track align='stretch'>
                <div style={{ flex: 1, borderRight: '1px solid #D2D3D8' }}>
                  {selectedFile && (
                    <Card
                      borderless
                      header={
                        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                        <strong>{t('training.mba.lastModified', { date: format(new Date(selectedFile.lastModified), 'dd.MM.yyyy') })}</strong>
                        <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
                          <Icon icon={<MdOutlineSettingsInputAntenna fontSize={24} />} size='medium' />
                          <p>{activeModel?.name}</p>
                        </Track>
                        </div>
                      }
                    >
                      {selectedFile.fileUri.endsWith('.png') ? (
                        <img src={selectedFile.fileUri} width='100%' alt='' />
                      ) : (
                        <iframe width='100%' height={500} src={selectedFile.fileUri} />
                      )}
                    </Card>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  {selectedFile && (
                    <Card
                      borderless
                      header={
                        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                        <strong>{t('training.mba.lastModified', { date: format(new Date(selectedFile.lastModified), 'dd.MM.yyyy') })}</strong>
                        <Track gap={8} style={{ whiteSpace: 'nowrap', color: '#308653' }}>
                          <Icon icon={<MdOutlineSettingsInputAntenna fontSize={24} />} size='medium' />
                          <p>{activeModel?.name}</p>
                        </Track>
                        </div>
                      }
                    >
                      {selectedFile.fileUri.endsWith('.png') ? (
                        <img src={selectedFile.fileUri} width='100%' alt='' />
                      ) : (
                        <iframe width='100%' height={500} src={selectedFile.fileUri} />
                      )}
                    </Card>
                  )}
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
