import { FC, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';

import { Switch, Track } from 'components';

type NodeDataProps = {
  data: {
    id: string;
    label: string;
    onDelete: (id: string) => void;
    type: string;
    onPayloadChange: (id: string, data: FormPayload) => void;
    payload: FormPayload;
  }
}

type FormPayload = { 
  active_loop?: boolean;
}

const FormNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();
  const { control, watch } = useForm();

  useEffect(() => {
    const { unsubscribe } = watch((value) => data.onPayloadChange(data.id, value));
    return () => unsubscribe();
  }, [watch]);

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
                defaultChecked={data.payload?.active_loop ?? true}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            )}
          />
        </div>
      </Track>
    </>
  );
};

export default memo(FormNode);
