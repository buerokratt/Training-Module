import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { AxiosError } from 'axios';
import { MdOutlineArrowBack } from 'react-icons/md';

import { Button, Card, FormCheckboxes, FormInput, FormSelect, Switch, Track } from 'components';
import { Intent } from 'types/intent';
import { Entity } from 'types/entity';
import { useToast } from 'hooks/useToast';
import { createSlot, editSlot } from 'services/slots';
import { Slot, SlotCreateDTO, SlotEditDTO } from 'types/slot';

type SlotsDetailProps = {
  mode: 'new' | 'edit';
}

const slotTypes = [
  {
    label: 'text',
    value: 'from_text',
  },
  {
    label: 'entity',
    value: 'from_entity',
  },
];

const errorStyle = {
  color: 'red',
  margin: 'auto'
}

const SlotsDetail: FC<SlotsDetailProps> = ({ mode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const params = useParams();
  const queryClient = useQueryClient();
  const [selectedSlotType, setSelectedSlotType] = useState<string | undefined>('from_text');
  const [selectedEntity, setSelectedEntity] = useState<string | undefined>('test');
  const [influenceConversation, setInfluenceConversation] = useState<boolean>(false);
  const { data: slot } = useQuery<Slot>({
    queryKey: [`slots/slotById`,params.id],
    enabled: mode === 'edit' && !!params.id,
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intent-and-id'],
  });
  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });

  const { register, formState: { errors },control, handleSubmit, reset } = useForm<SlotCreateDTO>({
    mode: 'onChange',
    shouldUnregister: true,
  });
  useEffect(() => {
    if (slot) {
      setSelectedEntity(slot.mappings.entity)
      setInfluenceConversation(slot.influenceConversation)
      setSelectedSlotType(slot.mappings.type)
      reset(slot);
    }
  }, [reset, slot]);

  const newSlotMutation = useMutation({
    mutationFn: (data: SlotCreateDTO) => createSlot(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['slots']);
      navigate('/training/slots');
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New slot added',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
  });

  const slotEditMutation = useMutation({
    mutationFn: (formData : {oldName: string,data: SlotEditDTO}) => editSlot(formData.oldName,formData.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['slots']);
      navigate('/training/slots');
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Slot changes saved',
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
  });

  const handleSlotSave = handleSubmit((data) => {
    if (mode === 'edit' && params.id) {
      console.log(params.id);
      slotEditMutation.mutate({oldName: params.id, data: data});
    } else {
      newSlotMutation.mutate(data);
    }
  });

  return (
    <>
      <Track gap={16}>
        <Button appearance='icon' onClick={() => navigate('/training/slots')}>
          <MdOutlineArrowBack />
        </Button>
        <h1>{t('training.slots.titleOne')}</h1>
        <Button onClick={handleSlotSave} style={{ marginLeft: 'auto' }}>{t('global.save')}</Button>
      </Track>
      <Card>
        <Track direction='vertical' align='left' gap={8}>
          {errors.name && <span style={errorStyle}>{errors.name.message}</span>}
          <FormInput {...register('name',{
            required: t('submit.slotNameRequired').toString(),
            minLength: {
              value: 1,
              message: t('submit.slotCantBeEmpty')
            }})} defaultValue={params.id} label={t('training.slots.slotName')} />
          <Controller name='mappings.type' control={control} render={({ field }) =>
            <FormSelect
              {...field}
              defaultValue={slot?.mappings.type || 'from_text'}
              label={t('training.slots.slotType')}
              options={slotTypes}
              onSelectionChange={(selection) => {
                setSelectedSlotType(selection?.value);
                field.onChange(selection?.value);
              }}
            />
          } />
          <Controller name='influenceConversation' control={control} render={({ field }) =>
            <Switch
              {...field}
              checked={influenceConversation}
              onCheckedChange={(e) => {
                setInfluenceConversation(e)
                field.onChange(e)} }
              label={t('training.slots.influenceConversation')}
            />
          } />
        </Track>
      </Card>
      {selectedSlotType && (
        <Card header={
          <h2 className='h5'>{t('training.slots.mapping')}</h2>
        }>
          <Track direction='vertical' gap={8} align='left'>
            {entities && selectedSlotType === 'from_entity' && (
                <Controller name='mappings.entity' control={control} render={({ field }) =>
                  <FormSelect
                      {...field}
                      label='Entity'
                      defaultValue={selectedEntity}
                      options={entities.map((entity) => ({ label: entity.name, value: entity.name }))}
                      onSelectionChange={(selection) => {
                        setSelectedEntity((selection?.value));
                        field.onChange(selection?.value);
                      }}
                  />}
                />
            )}
            {intents &&
              <FormCheckboxes {...register('mappings.intent')} label='Intent' items={intents.map((intent) => ({
                label: intent.intent,
                value: String(intent.id),
              }))} />}
            {intents &&
              <FormCheckboxes {...register('mappings.notIntent')} label='Not intent' items={intents.map((intent) => ({
                label: intent.intent,
                value: String(intent.id),
              }))} />}
          </Track>
        </Card>
      )}
    </>
  );
};

export default SlotsDetail;
