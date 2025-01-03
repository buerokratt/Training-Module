import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import { useSearchParams } from 'react-router-dom';

import Entities from './Entities';
import Regex from './Regex';
import withAuthorization, { ROLES } from 'hoc/with-authorization';

const IntentsFollowupTraining: FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  useEffect(() => {
    const queryTab = searchParams.get('tab');
    if (queryTab) {
      setSelectedTab(queryTab);
    }
  }, [searchParams]);

  return (
    <>
      <h1>{t('training.intents.followupTraining')}</h1>

      <h4>Entities</h4>
      <Tabs.Root
        className="vertical-tabs"
        orientation="vertical"
        value={selectedTab ?? undefined}
        onValueChange={setSelectedTab}
        defaultValue="regex"
      >
        <Tabs.Content key="regex" value="regex" className="vertical-tabs__body">
          <Entities />
        </Tabs.Content>
      </Tabs.Root>
      <h4>Regexes</h4>

      <Tabs.Root
        className="vertical-tabs"
        orientation="vertical"
        value={selectedTab ?? undefined}
        onValueChange={setSelectedTab}
        defaultValue="regex"
      >
        <Tabs.Content key="regex" value="regex" className="vertical-tabs__body">
          <Regex />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default withAuthorization(IntentsFollowupTraining, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
