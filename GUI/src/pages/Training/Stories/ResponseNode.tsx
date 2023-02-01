import { FC } from 'react';
import { useTranslation } from 'react-i18next';

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
      {'label' in data && (<p><strong>{t('training.response')}: {data.label}</strong></p>)}
    </>
  );
};

export default ResponseNode;
