import { FC, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineDelete } from 'react-icons/md';

import { Button, FormSelect, Icon, Track } from 'components';
import { Entity } from 'types/entity';

type NodeDataProps = {
  data: {
    id: string;
    label: string;
    onDelete: (id: string) => void;
    type: string;
    onPayloadChange: (id: string, data: EntityPayload) => void;
    payload: IntentPayload;
  }
}

type IntentPayload = {
  entities?: ({
    label: string;
    value: string;
  } | undefined)[] | undefined;
}

type EntityPayload = (string | undefined)[] | undefined;

const IntentNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();
  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });
  const { control, watch } = useForm<{ entities: { label: string; value: string }[] }>({
    defaultValues: {
      entities: data.payload.entities || [
        { label: t('training.intents.entity') || '', value: '' },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entities',
  });

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      const entities = value.entities?.map(x => x?.value).filter(Boolean);
      data.onPayloadChange(data.id, entities);
    });
    return () => unsubscribe();
  }, [watch]);

  return (
    <>
      {'label' in data && (<p><strong>{t('training.intent')}: {data.label}</strong></p>)}
      <p>entity:</p>

      {fields.map((item, index) => (
        <Track key={item.id} style={{ width: '100%' }}>
          <div style={{ flex: 1 }}>
            <Controller
              name={`entities.${index}.value` as const}
              control={control}
              render={({ field }) => (
                <FormSelect
                  {...field}
                  onSelectionChange={(selection) => field.onChange(selection)}
                  label={t('training.intents.entity')}
                  hideLabel
                  placeholder={t('training.intents.entity') || ''}
                  options={entities?.map((e) => ({ label: e.name, value: String(e.id) })) || []}
                />
              )}
            />
          </div>
          <Button appearance='icon' onClick={() => remove(index)}>
            <Icon icon={<MdOutlineDelete fontSize={24} />} size='medium' />
          </Button>
        </Track>
      ))}
      <Button
        size='s'
        appearance='success'
        onClick={() => append({ label: t('training.intents.entity'), value: '' })}
      >
        {t('global.add')}
      </Button>
    </>
  );
};

export default memo(IntentNode);
