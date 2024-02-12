import {FC, memo, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  MdAlarmOn,
  MdAppBlocking,
  MdCheckCircleOutline,
  MdOutlineCheck,
  MdOutlineDelete,
  MdWarning
} from 'react-icons/md';

import {Button, FormSelect, Icon, Tooltip, Track} from 'components';
import { Entity } from 'types/entity';
import ToolTipWarning from "../../../components/ToolTipWarning";

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
  const [entityWarning, setEntityWarning] = useState(false);
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
      const hasConsecutiveDuplicates = entities?.some((entity, index) => entity === entities[index + 1]);
      setEntityWarning(hasConsecutiveDuplicates ?? false);
      data.onPayloadChange(data.id, { entities });
    });
    return () => unsubscribe();
  }, [data, watch]);
  
  return (
    <>
      {'label' in data && (<p><strong>{t('training.intent')}: {data.label}</strong></p>)}
      <p>entity:</p>

      {fields.map((item, index) => (
        <Track key={item.id} style={{ width: '100%' }}>
          <div style={{ flex: 1 }}>
            <Controller
              name={`entities[${index}].value` as const}
              control={control}
              render={({ field }) => (
                <FormSelect
                    {...field}
                    value={field.value}
                    placeholder={t('training.intents.entity') || ''}
                    onSelectionChange={(selection) => {
                      const selectedValue = selection?.value || '';
                      field.onChange(selectedValue);
                    }}
                    label={t('training.intents.entity')}
                    hideLabel
                    options={entities?.map((e) => ({ label: e.name, value: String(e.id) })) || []}
                />
              )}
            />
          </div>
          {entityWarning && (
              <><ToolTipWarning content={t('training.stories.entityWarning')}>
                      <span style={{display: 'flex', alignItems: 'center'}}>
                          <Icon
                              icon={<MdWarning
                                  color={'rgba(255, 0, 0, 1)'}/>}/>
                      </span>
              </ToolTipWarning></>
          )}
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
