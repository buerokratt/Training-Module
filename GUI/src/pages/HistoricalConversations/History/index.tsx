import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const History: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('training.historicalConversations.title')}</h1>
    </>
  );
};

export default History;
