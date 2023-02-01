import { FC, memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineDelete } from 'react-icons/all';

import { Button, FormSelect, Icon, Track } from 'components';
import { Entity } from 'types/entity';

const IntentNode: FC<NodeProps> = (props) => {
  const { t } = useTranslation();
  const { data, isConnectable } = props;
  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });
  const { control } = useForm<{ entities: { label: string; value: string }[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entities',
  });

  return (
    <>
      <Handle
        type='target'
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <Track direction='vertical' gap={4} align='left'>
        {'label' in data && (<p><strong>{t('training.intent')}: {data.label}</strong></p>)}
        <p>entity:</p>

        {fields.map((item, index) => (
          <Track style={{ width: '100%' }}>
            <div style={{ flex: 1 }}>
              <Controller
                key={item.id}
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
      </Track>

      <Handle
        type='source'
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(IntentNode);
