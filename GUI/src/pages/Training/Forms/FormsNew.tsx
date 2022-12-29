import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import { Button, Card, DataTable, FormCheckbox, FormInput, Track } from 'components';
import { Intent } from 'types/intent';
import { Slot } from 'types/slot';
import { createColumnHelper } from '@tanstack/react-table';

const FormsNew: FC = () => {
  const { t } = useTranslation();
  const [slotsFilter, setSlotsFilter] = useState('');
  const [intentsFilter, setIntentsFilter] = useState('');
  const { data: slots } = useQuery<Slot[]>({
    queryKey: ['slots'],
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });
  const slotsColumnHelper = createColumnHelper<Slot>();
  const intentsColumnHelper = createColumnHelper<Intent>();

  const slotsColumns = useMemo(() => [
    slotsColumnHelper.accessor('name', {
      cell: (props) => (
        <FormCheckbox label="Slot" hideLabel name={} item={} />
      )
    }),
  ], [slotsColumnHelper]);

  const intentsColumns = useMemo(() => [
    intentsColumnHelper.accessor('intent', {}),
  ], [intentsColumnHelper]);

  return (
    <>
      <h1>{t('training.forms.titleOne')}</h1>

      <Card>
        <FormInput label={t('training.forms.formName')} name='formName' />
      </Card>

      <Track gap={16} align='left'>
        <div style={{ flex: 1 }}>
          <Card header={<h2 className='h5'>{t('training.forms.requiredSlots')}</h2>}>
            <DataTable data={slots} columns={slotsColumns} disableHead />
          </Card>
        </div>

        <div style={{ flex: 1 }}>
          <Card header={<h2 className='h5'>{t('training.forms.ignoredIntents')}</h2>}>
            <DataTable data={intents} columns={intentsColumns} disableHead />
          </Card>
        </div>
      </Track>

      <Track justify='end'>
        <Button>{t('global.save')}</Button>
      </Track>
    </>
  );
};

export default FormsNew;
