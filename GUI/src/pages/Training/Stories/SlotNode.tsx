import { FC, memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormInput, Track } from 'components';

type NodeDataProps = {
  data: {
    id: string;
    label: string;
    onDelete: (id: string) => void;
    type: string;
    onPayloadChange: (id: string, data: SlotPayload) => void;
    payload: SlotPayload;
  }
}

type SlotPayload = {
  value?: string;
}

const SlotNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();
  const { register, watch } = useForm();

  useEffect(() => {
    const { unsubscribe } = watch((value) => data.onPayloadChange(data.id, value));
    return () => unsubscribe();
  }, [watch]);

  return (
    <>
      {'label' in data && (<p><strong>{t('training.slot')}: {data.label}</strong></p>)}
      <Track style={{ width: '100%' }}>
        <div style={{ flex: 1 }}>
          <FormInput 
            {...register('value')} 
            label={t('training.value')}
            defaultValue={data.payload.value || 'null'}
          />
        </div>
      </Track>
    </>
  );
};

export default memo(SlotNode);
