import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Draggable from 'react-draggable';

import { Button, Collapsible, Track } from 'components';
import { Intent } from 'types/intent';
import './StoriesDetail.scss';

const StoriesDetail: FC = () => {
  const { t } = useTranslation();
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });

  return (
    <Track gap={16} align='left' style={{ height: '100%' }}>
      <div style={{ flex: 1, maxWidth: 'calc(100% / 3)' }}>
        <Track direction='vertical' gap={16} align='stretch'>
          <Collapsible title={t('training.intents.title')} defaultOpen>

          </Collapsible>

          <Collapsible title={t('training.responses.title')} defaultOpen>

          </Collapsible>

          <Collapsible title={t('training.forms.title')} defaultOpen>

          </Collapsible>

          <Collapsible title={t('training.actions.title')}>

          </Collapsible>
        </Track>
      </div>

      <div className='graph'>
        <div className='graph__header'>
          <h2 className='h3'>Cursus Nibh Ullamcorper</h2>
        </div>
        <div className='graph__body'>

        </div>
        <div className='graph__footer'>
          <Track gap={16} justify='end'>
            <Button appearance='secondary'>{t('global.back')}</Button>
            <Button appearance='error'>{t('global.delete')}</Button>
            <Button>{t('global.save')}</Button>
          </Track>
        </div>
      </div>
    </Track>
  );
};

export default StoriesDetail;
