import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { AxiosError } from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { MdCheckCircleOutline } from 'react-icons/md';

import { Button, Card, FormInput, FormSelect, Icon, Switch, Tooltip, Track } from 'components';
import { Config, PipelineComponent, Policy } from 'types/config';
import { editConfig } from 'services/config';
import { useToast } from 'hooks/useToast';

const Configuration: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [initialConfig, setInitialConfig] = useState<Config | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<PipelineComponent | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const { register, control, reset, handleSubmit, formState: { isDirty } } = useForm<Config>();
  const { data: configurationData } = useQuery<Config>({
    queryKey: ['active-configuration'],
    onSuccess: (data) => {
      reset(data);
      setInitialConfig(data);
    },
  });

  const configurationDataMutation = useMutation({
    mutationFn: (data: Config) => editConfig(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['active-configuration']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Configuration saved',
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

  if (!configurationData) return <>Loading...</>;

  const handleTabsValueChange = (value: string) => {
    const selectedPolicy = configurationData.policies.find((policy) => policy.name === value);
    if (selectedPolicy) setSelectedPolicy(selectedPolicy);
  };

  const handlePipelineTabsValueChange = (value: string) => {
    const selectedPipelineComponent = configurationData.pipeline.find((comp) => comp.name === value);
    if (selectedPipelineComponent) setSelectedComponent(selectedPipelineComponent);
  };

  const handleConfigSave = handleSubmit((data) => {
    configurationDataMutation.mutate(data);
  });

  return (
    <>
      <Track gap={16} justify='between'>
        <h1>{t('training.configuration.title')}</h1>
        <Track gap={8}>
          {initialConfig && isDirty && (
            <Button appearance='secondary' onClick={() => reset()}>{t('global.reset')}</Button>
          )}
          <Button onClick={handleConfigSave}>{t('global.save')}</Button>
        </Track>
      </Track>

      <Card header={
        <Controller
          name='recipe'
          control={control}
          render={({ field }) =>

            <FormSelect
              {...field}
              label={
                <>
                  {t('training.configuration.pipeline')}
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    textDecoration: 'underline',
                  }}>
                    {/* TODO: change kratid link url */}
                    <a href='#'>{t('training.configuration.moreFromKratid')}</a>
                  </p>
                </>
              }
              defaultValue={configurationData.recipe}
              onSelectionChange={(selection) => field.onChange(selection)}
              options={[
                { label: configurationData.recipe, value: configurationData.recipe },
              ]}
            />
          } />
      }>
        <Track direction='vertical' align='left' gap={8}>
          <Controller name='language' control={control} render={({ field }) =>
            <FormSelect
              {...field}
              label={t('global.language')}
              defaultValue={configurationData.language}
              onSelectionChange={(selection) => field.onChange(selection)}
              options={['et', 'en'].map((l) => ({ label: l, value: l }))}
            />
          } />
        </Track>
      </Card>

      <Tabs.Root className='vertical-tabs' orientation='vertical' onValueChange={handlePipelineTabsValueChange}>
        <Tabs.List className='vertical-tabs__list' aria-label={t('training.configuration.pipeline') || ''}>
          {configurationData.pipeline.map((comp, index) => (
            <Tabs.Trigger key={`${comp.name}-${index}`} value={`${comp.name}-${index}`} className='vertical-tabs__trigger'>
              <Track gap={16}>
                <span style={{ flex: 1 }}>{comp.name}</span>
                {comp.enabled && (
                  <Tooltip content={t('global.active')}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <Icon
                        icon={
                          <MdCheckCircleOutline
                            color={'rgba(0, 0, 0, 0.54)'}
                            opacity={comp.enabled ? 1 : 0}
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

        {configurationData.pipeline.map((comp, index) => (
          <Tabs.Content key={comp.name} value={`${comp.name}-${index}`} className='vertical-tabs__body'>
            <div className='vertical-tabs__content'>
              <Track direction='vertical' align='left' gap={8}>
                {'analyzer' in comp && (
                  <FormInput
                    {...register(`pipeline.${index}.analyzer`)}
                    label='analyzer'
                    defaultValue={comp.analyzer} />
                )}
                {'min_ngram' in comp && (
                  <FormInput
                    {...register(`pipeline.${index}.min_ngram`)}
                    label='min_ngram'
                    type='number'
                    defaultValue={comp.min_ngram} />
                )}
                {'max_ngram' in comp && (
                  <FormInput
                    {...register(`pipeline.${index}.max_ngram`)}
                    label='max_ngram'
                    type='number'
                    defaultValue={comp.max_ngram} />
                )}
                {'entity_recognition' in comp && (
                  <Controller
                    name={`pipeline.${index}.entity_recognition`}
                    control={control}
                    render={({ field }) =>
                      <Switch
                        {...field}
                        onCheckedChange={field.onChange}
                        label='entity_recognition'
                        checked={field.value}
                      />
                    }
                  />
                )}
                {'epochs' in comp && (
                  <FormInput
                    {...register(`pipeline.${index}.epochs`)}
                    label='epochs'
                    type='number'
                    defaultValue={comp.epochs} />
                )}
                {'random_seed' in comp && (
                  <FormInput
                    {...register(`pipeline.${index}.random_seed`)}
                    label='random_seed'
                    type='number'
                    defaultValue={comp.random_seed} />
                )}
                {'case_sensitive' in comp && (
                  <Controller
                    name={`pipeline.${index}.case_sensitive`}
                    control={control}
                    render={({ field }) =>
                      <Switch
                        {...field}
                        onCheckedChange={field.onChange}
                        label='case_sensitive'
                        checked={field.value}
                      />
                    }
                  />
                )}
                {'use_regexes' in comp && (
                  <Controller
                    name={`pipeline.${index}.use_regexes`}
                    control={control}
                    render={({ field }) =>
                      <Switch
                        {...field}
                        onCheckedChange={field.onChange}
                        label='use_regexes'
                        checked={field.value}
                      />
                    }
                  />
                )}
                <Controller
                  name={`pipeline.${index}.enabled`}
                  control={control}
                  render={({ field }) =>
                    <Switch
                      {...field}
                      onCheckedChange={field.onChange}
                      label={t('global.enabled')}
                      checked={field.value}
                    />
                  } />
              </Track>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <Tabs.Root className='vertical-tabs' orientation='vertical' onValueChange={handleTabsValueChange}>
        <Tabs.List className='vertical-tabs__list' aria-label={t('training.configuration.policies') || ''}>
          {configurationData.policies.map((policy, index) => (
            <Tabs.Trigger key={`${policy.name}-${index}`} value={policy.name} className='vertical-tabs__trigger'>
              <Track gap={16}>
                <span style={{ flex: 1 }}>{policy.name}</span>
                {policy.enabled && (
                  <Tooltip content={t('global.active')}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <Icon
                        icon={
                          <MdCheckCircleOutline
                            color={'rgba(0, 0, 0, 0.54)'}
                            opacity={policy.enabled ? 1 : 0}
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
                  {...register(`policies.${index}.priority`)}
                  label='priority'
                  type='number'
                />
                {'max_history' in policy && (
                  <FormInput
                    {...register(`policies.${index}.max_history`)}
                    label='max_history'
                    type='number'
                  />
                )}
                {'epochs' in policy && (
                  <FormInput
                    {...register(`policies.${index}.epochs`)}
                    label='epochs'
                    type='number'
                  />
                )}
                {'core_fallback_threshold' in policy && (
                  <FormInput
                    {...register(`policies.${index}.core_fallback_threshold`)}
                    label='core_fallback_threshold'
                    type='number'
                  />
                )}
                {'enable_fallback_prediction' in policy && (
                  <Controller
                    name={`policies.${index}.enable_fallback_prediction`}
                    control={control}
                    render={({ field }) =>
                      <Switch
                        {...field}
                        label='enable_fallback_prediction'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    } />
                )}
                <Controller
                  name={`policies.${index}.enabled`}
                  control={control}
                  render={({ field }) =>
                    <Switch
                      {...field}
                      label={t('global.enabled')}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  } />
              </Track>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </>
  );
};

export default Configuration;
