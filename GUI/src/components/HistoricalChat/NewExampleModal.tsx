import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { Button, Dialog, FormInput, FormSelect, Switch, Track } from 'components';
import { Message } from 'types/message';
import { Intent } from 'types/intent';

type NewExampleForm = {
  example: string;
  intent: string;
  newIntent: boolean;
  intentName?: string;
}

type NewExampleModalProps = {
  message: Message;
  setMessage: (payload: Message | null) => void;
  onSubmitExample: (data: NewExampleForm) => void;
}

const NewExampleModal: FC<NewExampleModalProps> = ({ message, setMessage, onSubmitExample }) => {
  const { t } = useTranslation();
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intent-and-id'],
  });
  const { register, control, handleSubmit } = useForm<NewExampleForm>({
    mode: 'onChange',
  });

  const watchIntent = useWatch({
    control,
    name: 'newIntent',
  });

  const handleNewExample = handleSubmit((data) => {
    onSubmitExample(data);
  });

  return (
    <Dialog
      title={t('training.mba.addExamples')}
      onClose={() => setMessage(null)}
      footer={
        <>
          <Button appearance='secondary' onClick={() => setMessage(null)}>
            {t('global.cancel')}
          </Button>
          <Button onClick={handleNewExample}>{t('global.save')}</Button>
        </>
      }
    >
      <Track direction='vertical' gap={16} align='left'>
        <FormInput {...register('example')} label={t('training.intents.example')} defaultValue={message.content} />
        {intents && (
          <Controller
            name='intent'
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                onSelectionChange={(selection) => field.onChange(selection)}
                label={t('training.mba.intent')}
                options={intents.map((intent) => ({ label: intent.intent, value: String(intent.id) }))}
              />
            )}
          />
        )}
        <Controller
          name='newIntent'
          control={control}
          render={({ field }) => (
            <Switch
              {...field}
              label={t('training.newIntent')}
              onLabel={t('global.yes') || ''}
              offLabel={t('global.no') || ''}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
          )}
        />
        {watchIntent && (
          <FormInput {...register('intentName')} label={t('training.intentName')} />
        )}
      </Track>
    </Dialog>
  );
};

export default NewExampleModal;
