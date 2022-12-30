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
        <FormCheckbox
          label={t('training.forms.requiredSlots')}
          hideLabel
          name='requiredSlots'
          item={{ label: props.getValue(), value: props.getValue() }}
        />
      ),
    }),
  ], [slotsColumnHelper, t]);

  const intentsColumns = useMemo(() => [
    intentsColumnHelper.accessor('intent', {
      cell: (props) => (
        <FormCheckbox
          label={t('training.forms.ignoredIntents')}
          hideLabel
          name='ignoredIntents'
          item={{ label: props.getValue(), value: props.getValue() }}
        />
      ),
    }),
  ], [intentsColumnHelper, t]);

  return (
    <>
      <h1>{t('training.forms.titleOne')}</h1>

      <Card>
        <FormInput label={t('training.forms.formName')} name='formName' />
      </Card>

      <Track gap={16} align='left'>
        <div style={{ flex: 1 }}>
          <Card header={
            <Track direction='vertical' align='left' style={{ margin: '-16px' }}>
              <h2
                className='h5'
                style={{
                  padding: 16,
                  width: '100%',
                  borderBottom: '1px solid #D2D3D8',
                }}
              >
                {t('training.forms.requiredSlots')}
              </h2>
              <div style={{ width: '100%', padding: 16 }}>
                <FormInput
                  label={t('global.search')}
                  name='slotsSearch'
                  placeholder={t('global.search') + '...'}
                  hideLabel
                  onChange={(e) => setSlotsFilter(e.target.value)}
                />
              </div>
            </Track>
          }>
            {slots && (
              <DataTable
                data={slots}
                columns={slotsColumns}
                disableHead
                globalFilter={slotsFilter}
                setGlobalFilter={setSlotsFilter}
              />
            )}
          </Card>
        </div>

        <div style={{ flex: 1 }}>
          <Card header={
            <Track direction='vertical' align='left' style={{ margin: '-16px' }}>
              <h2
                className='h5'
                style={{
                  padding: 16,
                  width: '100%',
                  borderBottom: '1px solid #D2D3D8',
                }}
              >
                {t('training.forms.ignoredIntents')}
              </h2>
              <div style={{ width: '100%', padding: 16 }}>
                <FormInput
                  label={t('global.search')}
                  name='intentsSearch'
                  placeholder={t('global.search') + '...'}
                  hideLabel
                  onChange={(e) => setIntentsFilter(e.target.value)}
                />
              </div>
            </Track>
          }>
            {intents && (
              <DataTable
                data={intents}
                columns={intentsColumns}
                disableHead
                globalFilter={intentsFilter}
                setGlobalFilter={setIntentsFilter}
              />
            )}
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
