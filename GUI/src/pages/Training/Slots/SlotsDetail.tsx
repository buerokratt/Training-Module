import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
    value: 'text',
  },
  {
    label: 'entity',
    value: 'entity',
  },
];

const SlotsDetail: FC<SlotsDetailProps> = ({ mode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const params = useParams();
  const queryClient = useQueryClient();
  const [selectedSlotType, setSelectedSlotType] = useState<string | null>(null);
  const { data: slot } = useQuery<Slot>({
    queryKey: [`slots/${params.id}`],
    enabled: mode === 'edit' && !!params.id,
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });
  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });

  const { register, handleSubmit, reset } = useForm<SlotCreateDTO>({
    mode: 'onChange',
    shouldUnregister: true,
  });

  useEffect(() => {
    if (slot) {
      reset(slot);
    }
  }, [reset, slot]);

  const newSlotMutation = useMutation({
    mutationFn: (data: SlotCreateDTO) => createSlot(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['slots']);
      navigate('/treening/treening/pilud');
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
    mutationFn: ({ id, data }: { id: string | number, data: SlotEditDTO }) => editSlot(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['slots']);
      navigate('/treening/treening/pilud');
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
      slotEditMutation.mutate({ id: params.id, data });
    } else {
      newSlotMutation.mutate(data);
    }
  });

  return (
    <>
      <Track gap={16}>
        <Button appearance='icon' onClick={() => navigate('/treening/treening/pilud')}>
          <MdOutlineArrowBack />
        </Button>
        <h1>{t('training.slots.titleOne')}</h1>
        <Button onClick={handleSlotSave} style={{ marginLeft: 'auto' }}>{t('global.save')}</Button>
      </Track>

      <Card>
        <Track direction='vertical' align='left' gap={8}>
          <FormInput {...register('name')} label={t('training.slots.slotName')} />
          <FormSelect
            {...register('type')}
            label={t('training.slots.slotType')}
            options={slotTypes}
            onSelectionChange={(selection) => setSelectedSlotType((selection?.value) || null)}
          />
          <Switch
            {...register('influenceConversation')}
            label={t('training.slots.influenceConversation')}
          />
        </Track>
      </Card>

      {selectedSlotType === 'entity' && (
        <Card header={
          <h2 className='h5'>{t('training.slots.mapping')}</h2>
        }>
          <Track direction='vertical' gap={8} align='left'>
            {entities && (
              <FormSelect
                {...register('mappings.entity')}
                label='Entity'
                options={entities.map((entity) => ({ label: entity.name, value: String(entity.id) }))}
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
