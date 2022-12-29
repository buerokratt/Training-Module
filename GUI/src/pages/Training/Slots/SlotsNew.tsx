import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import { Button, Card, FormCheckboxes, FormInput, FormSelect, Switch, Track } from 'components';
import { Intent } from 'types/intent';
import { Entity } from 'types/entity';

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

const influenceConversationTypes = [
  {
    label: 'true',
    value: 'true',
  },
  {
    label: 'false',
    value: 'false',
  },
];

const SlotsNew: FC = () => {
  const { t } = useTranslation();
  const [selectedSlotType, setSelectedSlotType] = useState<string | null>(null);
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });
  const { data: entities } = useQuery<Entity[]>({
    queryKey: ['entities'],
  });

  return (
    <>
      <h1>{t('training.slots.newSlot')}</h1>

      <Card>
        <Track direction='vertical' align='left' gap={8}>
          <FormInput label={t('training.slots.slotName')} name='name' />
          <FormSelect
            label={t('training.slots.slotType')}
            name='type'
            options={slotTypes}
            onSelectionChange={(selection) => setSelectedSlotType((selection?.value) || null)}
          />
          <Switch
            label={t('training.slots.influenceConversation')}
            name='influenceConversations'
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
                label='Entity'
                name='type'
                options={entities.map((entity) => ({ label: entity.name, value: String(entity.id) }))}
              />
            )}
            {intents && <FormCheckboxes label='Intent' name='intent' items={intents.map((intent) => ({
              label: intent.intent,
              value: String(intent.id),
            }))} />}
            {intents && <FormCheckboxes label='Not intent' name='notIntent' items={intents.map((intent) => ({
              label: intent.intent,
              value: String(intent.id),
            }))} />}
          </Track>
        </Card>
      )}

      <Track justify='end'>
        <Button>{t('global.save')}</Button>
      </Track>
    </>
  );
};

export default SlotsNew;
