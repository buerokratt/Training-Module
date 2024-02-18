import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { Button, FormInput, FormSelect, Icon, Track } from 'components';
import { Form } from 'types/form';
import { MdOutlineDelete } from 'react-icons/md';
import {Slot} from "../../../types/slot";

type NodeDataProps = {
  data: {
    id: string;
    label: string;
    onDelete: (id: string) => void;
    type: string;
    onPayloadChange: (id: string, data: Conditions) => void;
    payload: Conditions;
  };
};

type Conditions = {
  conditions?: ({
    active_loop?: string | undefined;
    slot?: string | undefined;
    value?: string | undefined;
  }| undefined)[] | undefined;
};

const ConditionNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();
  const { data: forms } = useQuery<Form[]>({
    queryKey: ['forms'],
  });
  const { data: slots } = useQuery<Slot[]>({
    queryKey: ['slots'],
  });
  const { control, watch } = useForm<Conditions>({
    defaultValues: {
      conditions: [{ active_loop: '' }, { slot: '', value: 'null' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'conditions',
  });

  useEffect(() => {
    const { unsubscribe } = watch((value) => data.onPayloadChange(data.id, value));
    return () => unsubscribe();
  }, [watch]);

  return (
    <>
      <p>
        <strong>
          {t('training.conditions')}: {data.label}
        </strong>
      </p>
      {fields.map((item, index) => (
        <>
          {item.active_loop !== undefined ? (
            <Track key={item.id} style={{ width: '100%' }}>
              <div style={{ flex: 1 }}>
                <Controller
                  name={`conditions.${index}.active_loop` as const}
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      {...field}
                      onSelectionChange={(selection) => {
                        field.onChange(selection)
                      }
                    }
                      value={field.value?.label ?? null}
                      label="active_loop"
                      placeholder={t('training.forms.title') || ''}
                      options={
                        forms?.map((f) => ({
                          label: f.form,
                          value: String(f.id),
                        })) || []
                      }
                    />
                  )}
                />
              </div>
              <Button appearance="icon" onClick={() => remove(index)}>
                <Icon icon={<MdOutlineDelete fontSize={24} />} size="medium" />
              </Button>
            </Track>
          ) : (
            <Track
              direction="vertical"
              gap={4}
              align="left"
              style={{
                padding: 4,
                backgroundColor: '#B3D3C0',
                borderRadius: 4,
                width: '100%',
              }}
            >
              <Track key={item.id} style={{ width: '100%' }}>
                <div style={{ flex: 1 }}>
                  <Controller
                      name={`conditions.${index}.slot` as const}
                      control={control}
                      render={({ field }) => (
                          <FormSelect
                              {...field}
                              onSelectionChange={(selection) => {
                                field.onChange(selection);
                              }}
                              value={field.value?.label ?? null}
                              label="slot"
                              options={Array.from(new Set(slots || [])).map((f) => ({
                                label: f.id,
                                value: String(f.id),
                              }))}
                          />
                      )}
                  />
                </div>
                <Button appearance="icon" onClick={() => remove(index)}>
                  <Icon
                    icon={<MdOutlineDelete fontSize={24} />}
                    size="medium"
                  />
                </Button>
              </Track>
              <Track key={item.id} style={{ width: '90%' }}>
                <div style={{ flex: 1 }}>
                  <Controller
                    name={`conditions.${index}.value` as const}
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        {...field}
                        // onChange={(value) => field.onChange(value)}
                        label={t('training.value')}
                        // value={field.value}
                      />
                    )}
                  />
                </div>
              </Track>
            </Track>
          )}
        </>
      ))}
      <Track gap={8}>
        <Button
          appearance="success"
          size="s"
          onClick={() => append({ active_loop: '' })}
        >
          {t('global.add')} active_loop
        </Button>
        <Button
          appearance="success"
          size="s"
          onClick={() => append({ slot: '', value: 'null' })}
        >
          {t('global.add')} slot
        </Button>
      </Track>
    </>
  );
};

export default ConditionNode;
