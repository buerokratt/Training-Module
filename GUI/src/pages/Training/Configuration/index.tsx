import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { MdCheckCircleOutline } from 'react-icons/md';

import { Button, Card, FormInput, FormSelect, Icon, Switch, Tooltip, Track } from 'components';
import { Config, Policy } from 'types/config';

const Configuration: FC = () => {
  const { t } = useTranslation();
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>();
  const { data: configurationData } = useQuery<Config>({
    queryKey: ['active-configuration'],
  });

  if (!configurationData) return <>Loading...</>;

  const handleTabsValueChange = (value: string) => {
    const selectedPolicy = configurationData.policies.find((policy) => policy.name === value);
    setSelectedPolicy(selectedPolicy);
  };

  const handlePolicyActivate = async (policy: Policy) => {
    // TODO: Add endpoint for activating config policy
  };

  const handlePolicyDeactivate = async (policy: Policy) => {
    // TODO: Add endpoint for deactivating config policy
  };

  return (
    <>
      <h1>{t('training.configuration.title')}</h1>
      <Card header={
        <FormSelect
          label={t('training.configuration.pipeline')}
          name='recipe'
          defaultValue={configurationData.recipe}
          options={[
            { label: configurationData.recipe, value: configurationData.recipe },
          ]} />
      }>
        <Track direction='vertical' align='left' gap={8}>
          <FormSelect
            label={t('global.language')}
            name='language'
            defaultValue={configurationData.language}
            options={['et', 'en'].map((l) => ({ label: l, value: l }))}
          />
          <FormInput
            label={t('training.configuration.epochs')}
            name='pipeline.epochs'
            defaultValue={configurationData.pipeline.epochs}
            type='number' />
          <FormInput
            label={t('training.configuration.randomSeed')}
            name='pipeline.randomSeed'
            defaultValue={configurationData.pipeline.randomSeed}
            type='number' />
          <FormInput
            label={t('training.configuration.threshold')}
            name='pipeline.threshold'
            defaultValue={configurationData.pipeline.threshold}
            type='number' />
        </Track>
      </Card>

      <Tabs.Root className='vertical-tabs' orientation='vertical' onValueChange={handleTabsValueChange}>
        <Tabs.List className='vertical-tabs__list' aria-label={t('training.configuration.policies') || ''}>
          {configurationData.policies.map((policy, index) => (
            <Tabs.Trigger key={`${policy.name}-${index}`} value={policy.name} className='vertical-tabs__trigger'>
              <Track gap={16}>
                <span style={{ flex: 1 }}>{policy.name}</span>
                {policy.active && (
                  <Tooltip content={t('global.active')}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <Icon
                        icon={
                          <MdCheckCircleOutline
                            color={'rgba(0, 0, 0, 0.54)'}
                            opacity={policy.active ? 1 : 0}
                          />
                        }
                      />
                    </span>
                  </Tooltip>
                )}
              </Track>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {selectedPolicy && (
          <Tabs.Content key={selectedPolicy.name} value={selectedPolicy.name} className='vertical-tabs__body'>
            <div className='vertical-tabs__content'></div>
            <div className='vertical-tabs__content-footer'>
              {selectedPolicy.active ? (
                <Button appearance='error'
                        onClick={() => handlePolicyDeactivate(selectedPolicy)}>{t('global.deactivate')}</Button>
              ) : (
                <Button onClick={() => handlePolicyActivate(selectedPolicy)}>{t('global.activate')}</Button>
              )}
            </div>
          </Tabs.Content>
        )}
      </Tabs.Root>

      <Card>
        <Track gap={16}>
          <div style={{ minWidth: 187 }}>
            <p>{t('training.intents.commonIntents')}</p>
            <p style={{
              fontSize: 14,
              lineHeight: 1.5,
              textDecoration: 'underline',
            }}>
              {/* TODO: change githubi link url */}
              <a href='#'>{t('training.intents.moreFromGithub')}</a>
            </p>
          </div>
          <Switch label='Common intents' hideLabel name='commonIntents' defaultChecked={true} />
        </Track>
      </Card>
    </>
  );
};

export default Configuration;
