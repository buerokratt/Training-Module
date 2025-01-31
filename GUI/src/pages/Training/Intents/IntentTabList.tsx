import { FC, useMemo, useState } from 'react';
import { SwitchBox } from 'components';
import { useTranslation } from 'react-i18next';
import { compareInModel, compareInModelReversed } from 'utils/compare';
import IntentList from './IntentList';
import './IntentTabList.scss';
import { IntentWithExamplesCount } from 'types/intentWithExamplesCount';

interface IntentTabListProps {
  filter: string;
  intents: IntentWithExamplesCount[];
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
      return filteredIntents.sort(compareInModel);
    } else if (order === 'inmodel-Desc') {
      return filteredIntents.sort(compareInModelReversed);
    } else if (order === 'modified-asc') {
      return filteredIntents.sort((a, b) => a.modifiedAt.localeCompare(b.modifiedAt));
    } else if (order === 'modified-desc') {
      return filteredIntents.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
    }
    return filteredIntents;
  }, [filteredIntents, order]);

  const nonCommonIntents = sortedIntents.filter((intent) => !intent.isCommon);
  const commonIntents = sortedIntents.filter((intent) => intent.isCommon);

  return (
    <div className="vertical-tabs__list-scrollable">
      <div style={{ padding: '10px' }}>
        <div className="sorting-control margin-bottom">
          <label htmlFor="show-common-toggle">{t('training.intents.commonIntents')}</label>
          <SwitchBox
            id="show-common-toggle"
            checked={showCommons}
            hideLabel
            label=""
            onCheckedChange={() => {
              onDismiss();
              setShowCommons(!showCommons);
            }}
          />
        </div>
        <div className="sorting-control">
          <label htmlFor="sorting-type-control">{t('training.intents.sortingType.label')}</label>
          <select id="sorting-type-control" value={order} onChange={(e) => setOrder(e.target.value)}>
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
      <IntentList intents={nonCommonIntents} />
      {showCommons && <div className="divider" />}
      {showCommons && <IntentList intents={commonIntents} />}
    </div>
  );
};

export default IntentTabList;
