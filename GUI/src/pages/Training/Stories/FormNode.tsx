import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';

import { Switch, Track } from 'components';

type NodeDataProps = {
  data: {
    label: string;
    onDelete: (id: string) => void;
    type: string;
  }
}

const FormNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();
  const { control } = useForm();

  return (
    <>
      {'label' in data && (<p><strong>{t('training.form')}: {data.label}</strong></p>)}
      <Track style={{ width: '100%' }}>
        <div style={{ flex: 1 }}>
          <Controller
            name='active_loop'
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                label='active_loop'
                defaultChecked={true}
              />
            )}
          />
        </div>
      </Track>
    </>
  );
};

export default memo(FormNode);
