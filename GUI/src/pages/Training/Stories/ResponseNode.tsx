import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Track } from 'components';

type NodeDataProps = {
  data: {
    label: string;
    onDelete: (id: string) => void;
    type: string;
  }
}

const ResponseNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <>
      <Track direction='vertical' gap={4} align='left'>
        {'label' in data && (<p><strong>{t('training.response')}: {data.label}</strong></p>)}
      </Track>
    </>
  );
};

export default ResponseNode;
