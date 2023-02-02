import { FC, memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormInput, Track } from 'components';

type NodeDataProps = {
  data: {
    label: string;
    onDelete: (id: string) => void;
    type: string;
  }
}

const SlotNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();
  const { register } = useForm();

  return (
    <>
      {'label' in data && (<p><strong>{t('training.slot')}: {data.label}</strong></p>)}
      <Track style={{ width: '100%' }}>
        <div style={{ flex: 1 }}>
          <FormInput {...register('value')} label={t('training.value')} defaultValue={'null'} />
        </div>
      </Track>
    </>
  );
};

export default memo(SlotNode);
