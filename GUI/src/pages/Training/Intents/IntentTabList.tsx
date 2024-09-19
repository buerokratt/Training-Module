import { FC, useMemo, useState } from "react";
import * as Tabs from '@radix-ui/react-tabs';
import { Icon, SwitchBox, Tooltip, Track } from 'components';
import { MdCheckCircleOutline } from 'react-icons/md';
import { useTranslation } from "react-i18next";
import { Intent } from "types/intent";
import "./IntentTabList.scss";

interface IntentTabListProps {
  filter: string;
  intents: Intent[];
  onDismiss: () => void;
}

const IntentTabList: FC<IntentTabListProps> = ({ filter, intents, onDismiss }) => {
  const { t } = useTranslation();

  const [showCommons, setShowCommons] = useState(true);
  const [order, setOrder] = useState('alphabetically-asc');

  const filteredIntents = useMemo(() => {
    const formattedFilter = filter.trim().replace(/\s+/g, '_');
    return intents?.filter((intent) => intent.id?.includes(formattedFilter));
  }, [intents, filter]);

  const sortedIntents = useMemo(() => {
    if (order === 'alphabetically-asc') {
      return filteredIntents.sort((a, b) => a.id.localeCompare(b.id));
    } else if (order === 'alphabetically-Desc') {
      return filteredIntents.sort((a, b) => b.id.localeCompare(a.id));
    } else if (order === 'inmodel-asc') {
      return filteredIntents.sort((a, b) => a.inModel === b.inModel ? 0 : a.inModel ? -1 : 1);
    } else if (order === 'inmodel-Desc') {
      return filteredIntents.sort((a, b) => a.inModel === b.inModel ? 0 : a.inModel ? 1 : -1);
    } else if (order === 'modified-asc') {
      return filteredIntents.sort((a, b) => a.modifiedAt.localeCompare(b.modifiedAt));
    } else if (order === 'modified-desc') {
      return filteredIntents.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
    }
    return filteredIntents;
  }, [filteredIntents, order]);

  const nonCommonIntents = sortedIntents.filter((intent) => !intent.isCommon);
  const commonIntents = sortedIntents.filter((intent) => intent.isCommon);

  const renderTab = (intent: Intent, index: number) => (
    <Tabs.Trigger
      key={`${intent}-${index}`}
      className="vertical-tabs__trigger"
      value={intent.id}
    >
      <Track gap={16}>
      <span style={{ flex: 1 }}>
        {intent.id.replace(/_/g, ' ')}
      </span>
        <Tooltip content={t('training.intents.amountOfExamples')}>
        <span style={{ color: '#5D6071' }}>
          {intent.examplesCount}
        </span>
        </Tooltip>
        {intent.inModel ? (
          <Tooltip content={t('training.intents.intentInModel')}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <Icon
              icon={
                <MdCheckCircleOutline
                  color={'rgba(0, 0, 0, 0.54)'}
                  opacity={intent.inModel ? 1 : 0}
                />
              }
            />
          </span>
          </Tooltip>
        ) : (
          <span style={{ display: 'block', width: 16 }}></span>
        )}
      </Track>
    </Tabs.Trigger>
  );

  return (
    <div className="vertical-tabs__list-scrollable">
      <div style={{ padding: "10px" }}>
        <div className='sorting-control margin-bottom'>
          <label htmlFor='show-common-toggle'>{t('training.intents.commonIntents')}</label>
          <SwitchBox
            id='show-common-toggle'
            checked={showCommons}
            hideLabel
            label=''
            onCheckedChange={() => {
              onDismiss();
              setShowCommons(!showCommons);
            }} 
          />
        </div>
        <div className='sorting-control'>
          <label htmlFor='sorting-type-control'>{t('training.intents.sortingType.label')}</label>
          <select id='sorting-type-control'
            value={order}
            onChange={e => setOrder(e.target.value)}
          >
            <option value="alphabetically-asc">{t('training.intents.sortingType.alphabeticalAsc')}</option>
            <option value="alphabetically-Desc">{t('training.intents.sortingType.alphabeticalDesc')}</option>
            <option value="inmodel-asc">{t('training.intents.sortingType.inModelFirst')}</option>
            <option value="inmodel-Desc">{t('training.intents.sortingType.inModelLast')}</option>
            <option value="modified-asc">{t('training.intents.sortingType.lastModifiedAsc')}</option>
            <option value="modified-desc">{t('training.intents.sortingType.lastModifiedDesc')}</option>
          </select>
        </div>
      </div>
      <div className="divider" />
      {nonCommonIntents.map(renderTab)}
      {showCommons && <div className="divider" />}
      {showCommons && commonIntents.map(renderTab)}
    </div>
  )
}

export default IntentTabList;
