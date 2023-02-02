import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { FormInput, Track } from 'components';

type NodeDataProps = {
  data: {
    label: string;
    onDelete: (id: string) => void;
    type: string;
    checkpoint?: boolean;
  }
}

const ActionNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();
  const { checkpoint } = data;
  const { register } = useForm();

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
