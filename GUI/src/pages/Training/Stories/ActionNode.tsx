import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { FormInput, Track } from 'components';

type NodeDataProps = {
  data: {
    id: string;
    label: string;
    onDelete: (id: string) => void;
    type: string;
    checkpoint?: boolean;
    onPayloadChange: (id: string, data: any) => void;
    payload: any;
  }
}

const ActionNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();
  const { checkpoint } = data;
  const { register, watch } = useForm();

  useEffect(() => {
    const { unsubscribe } = watch((value) => data.onPayloadChange(data.id, value));
    return () => unsubscribe();
  }, [watch]);

  return (
    <>
      {checkpoint ? (
        <>
          {'label' in data && <p><strong>{data.label}</strong></p>}
          <Track style={{ width: '100%' }}>
            <div style={{ flex: 1 }}>
              <FormInput {...register('value')} label={t('training.value')} />
            </div>
          </Track>
        </>
      ) : (
        <>
          {'label' in data && <p><strong>{t('training.actions.title')}: {data.label}</strong></p>}
        </>
      )}
    </>
  );
};

export default ActionNode;
