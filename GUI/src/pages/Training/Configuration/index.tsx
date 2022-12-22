import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, FormInput, FormSelect, Track } from 'components';

const Configuration: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('training.configuration.title')}</h1>
      <Card header={<FormSelect label={t('training.configuration.pipeline')} name='pipeline' options={[]} />}>
        <Track direction='vertical' align='left' gap={8}>
          <FormSelect
            label={t('global.language')}
            name='language'
            options={['et', 'en'].map((l) => ({ label: l, value: l }))}
          />
          <FormInput label='Epochs' name='epochs' type='number' />
          <FormInput label='Random seed' name='random-seed' type='number' />
          <FormInput label='Threshold' name='threshold' type='number' />
        </Track>
      </Card>
    </>
  );
};

export default Configuration;
