import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Card, FormInput, FormSelect, Track } from 'components';

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

  console.log(selectedSlotType);

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
          <FormSelect
            label={t('training.slots.influenceConversation')}
            name='influenceConversations'
            options={influenceConversationTypes}
          />
        </Track>
      </Card>

      {selectedSlotType === 'entity' && (
        <Card header={
          <h2 className='h5'>{t('training.slots.mapping')}</h2>
        }>
          <Track direction='vertical' gap={8} align='left'>
            <FormSelect label='Type' name='type' options={[{ label: 'form_entity', value: 'form_entity' }]} />
            <FormSelect label='Entity' name='type' options={[]} />
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
