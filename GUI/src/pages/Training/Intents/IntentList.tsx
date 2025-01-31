import { FC } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Icon, Tooltip, Track } from 'components';
import { MdCheckCircleOutline } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import './IntentTabList.scss';
import { IntentWithExamplesCount } from 'types/intentWithExamplesCount';

interface IntentListProps {
  intents: IntentWithExamplesCount[];
}

const IntentList: FC<IntentListProps> = ({ intents }) => {
  const { t } = useTranslation();

  return (
    <>
      {intents.map((intent, index) => (
        <Tabs.Trigger key={`${intent}-${index}`} className="vertical-tabs__trigger" value={intent.id}>
          <Track gap={16}>
            <span style={{ flex: 1 }}>{intent.id.replace(/_/g, ' ')}</span>
            <Tooltip content={t('training.intents.amountOfExamples')}>
              <span style={{ color: '#5D6071' }}>{intent.examplesCount}</span>
            </Tooltip>
            {!intent.inModel ? (
              <span style={{ display: 'block', width: 16 }}></span>
            ) : (
              <Tooltip content={t('training.intents.intentInModel')}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon
                    icon={<MdCheckCircleOutline color={'rgba(0, 0, 0, 0.54)'} opacity={intent.inModel ? 1 : 0} />}
                  />
                </span>
              </Tooltip>
            )}
          </Track>
        </Tabs.Trigger>
      ))}
    </>
  );
};

export default IntentList;
