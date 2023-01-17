import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { MdCheckCircleOutline } from 'react-icons/md';

import { Button, Card, FormInput, FormSelect, Icon, Switch, Tooltip, Track } from 'components';
import { Config, Policy } from 'types/config';
import { useForm } from 'react-hook-form';

const Configuration: FC = () => {
  const { t } = useTranslation();
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>();
  const { data: configurationData } = useQuery<Config>({
    queryKey: ['active-configuration'],
  });

  const { register, handleSubmit } = useForm();

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

  const handleConfigSave = handleSubmit((data) => {

  });

  return (
    <>
      <Track gap={16}>
        <h1>{t('training.configuration.title')}</h1>
        <Button onClick={handleConfigSave} style={{ marginLeft: 'auto' }}>{t('global.save')}</Button>
      </Track>

      <Card header={
        <FormSelect
          {...register('recipe')}
          label={t('training.configuration.pipeline')}
          defaultValue={configurationData.recipe}
          options={[
            { label: configurationData.recipe, value: configurationData.recipe },
          ]} />
      }>
        <Track direction='vertical' align='left' gap={8}>
          <FormSelect
            {...register('language')}
            label={t('global.language')}
            defaultValue={configurationData.language}
            options={['et', 'en'].map((l) => ({ label: l, value: l }))}
          />
          <FormInput
            {...register('pipeline.epochs')}
            label={t('training.configuration.epochs')}
            defaultValue={configurationData.pipeline.epochs}
            type='number' />
          <FormInput
            {...register('pipeline.randomSeed')}
            label={t('training.configuration.randomSeed')}
            defaultValue={configurationData.pipeline.randomSeed}
            type='number' />
          <FormInput
            {...register('pipeline.threshold')}
            label={t('training.configuration.threshold')}
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

        {configurationData.policies.map((policy, index) => (
          <Tabs.Content key={policy.id} value={policy.name} className='vertical-tabs__body'>
            <div className='vertical-tabs__content'>
              <Track direction='vertical' align='left' gap={8}>
                <FormInput
                  label={t('training.configuration.priority')}
                  name={`policies[${index}].priority`}
                  defaultValue={policy.priority} type='number'
                />
                {'maxHistory' in policy && (
                  <FormInput
                    label={t('training.configuration.maxHistory')}
                    name={`policies[${index}].maxHistory`}
                    defaultValue={policy.maxHistory} type='number'
                  />
                )}
                {'epochs' in policy && (
                  <FormInput
                    label={t('training.configuration.epochs')}
                    name={`policies[${index}].epochs`}
                    defaultValue={policy.epochs} type='number'
                  />
                )}
                {'coreFallbackThreshold' in policy && (
                  <FormInput
                    label={t('training.configuration.coreFallbackThreshold')}
                    name={`policies[${index}].coreFallbackThreshold`}
                    defaultValue={policy.coreFallbackThreshold} type='number'
                  />
                )}
                {'checkForContradictions' in policy && (
                  <Switch
                    label={t('training.configuration.checkForContradictions')}
                    defaultChecked={policy.checkForContradictions}
                    name={`policies[${index}].checkForContradictions`}
                  />
                )}
              </Track>
            </div>
            <div className='vertical-tabs__content-footer'>
              {policy.active ? (
                <Button appearance='error'
                        onClick={() => handlePolicyDeactivate(policy)}>{t('global.deactivate')}</Button>
              ) : (
                <Button onClick={() => handlePolicyActivate(policy)}>{t('global.activate')}</Button>
              )}
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </>
  );
};

export default Configuration;
