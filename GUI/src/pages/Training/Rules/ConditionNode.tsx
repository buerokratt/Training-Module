import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, FormInput, FormSelect, Icon, Track } from 'components';
import { MdOutlineDelete } from 'react-icons/md';
import { Slot } from '../../../types/slot';
import { useInfinitePagination } from 'hooks/useInfinitePagination';
import { getForms } from 'services/forms';
import { flattenPaginatedData } from 'utils/api-utils';
import { getSlots } from 'services/slots';

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

type SelectOption = {
  label: string;
  value: string;
};

type Conditions = {
  conditions?: (
    | {
        active_loop?: SelectOption;
        slot?: SelectOption;
        value?: string;
      }
    | undefined
  )[];
};

const ConditionNode: FC<NodeDataProps> = ({ data }) => {
  const { t } = useTranslation();

  const { data: formsData } = useInfinitePagination<string>({
    queryKey: ['forms'],
    fetchFn: getForms,
    pageSize: 1000,
  });
  const forms = useMemo(() => flattenPaginatedData(formsData), [formsData]);

  const { data: slotsData } = useInfinitePagination<string>({
    queryKey: ['slots'],
    fetchFn: getSlots,
    pageSize: 1000,
  });
  const slots = useMemo(() => flattenPaginatedData(slotsData), [slotsData]);

  const { control, watch } = useForm<Conditions>({
    defaultValues: {
      conditions: [{ active_loop: { label: '', value: '' } }, { slot: { label: '', value: '' }, value: '' }],
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
                  render={({ field }) => {
                    console.log(field.value);
                    return (
                      <FormSelect
                        {...field}
                        onSelectionChange={(selection) => {
                          field.onChange(selection);
                        }}
                        value={field.value?.label}
                        label="active_loop"
                        placeholder={t('training.forms.title') || ''}
                        options={forms.map((f) => ({ label: f, value: f }))}
                      />
                    );
                  }}
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
              <Track key={`${index}-${item.id}`} style={{ width: '100%' }}>
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
                        value={field.value?.label}
                        label={t('training.slot')}
                        options={slots.map((f) => ({ label: f, value: f }))}
                      />
                    )}
                  />
                </div>
                <Button appearance="icon" onClick={() => remove(index)}>
                  <Icon icon={<MdOutlineDelete fontSize={24} />} size="medium" />
                </Button>
              </Track>
              <Track key={`${index}-${item.id}-value`} style={{ width: '90%' }}>
                <div style={{ flex: 1 }}>
                  <Controller
                    name={`conditions.${index}.value` as const}
                    control={control}
                    render={({ field }) => <FormInput {...field} label={t('training.value')} />}
                  />
                </div>
              </Track>
            </Track>
          )}
        </>
      ))}
      <Track gap={8}>
        <Button appearance="success" size="s" onClick={() => append({ active_loop: { label: '', value: '' } })}>
          {t('global.add')} active_loop
        </Button>
        <Button appearance="success" size="s" onClick={() => append({ slot: { label: '', value: '' } })}>
          {t('global.add')} slot
        </Button>
      </Track>
    </>
  );
};

export default ConditionNode;
