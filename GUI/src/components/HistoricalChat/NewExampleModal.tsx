import {FC, useState} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { Button, Dialog, FormInput, FormSelect, Switch, Track } from 'components';
import { Message } from 'types/message';
import { Intent } from 'types/intent';
import Select from 'react-select';
import './NewExampleModal.scss';

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
  const [isNewIntent, setIsNewIntent] = useState<boolean>(false);
  const [intentName, setIntentName] = useState<string>('');
  const [ selectedIntent, setSelectedIntent ] = useState<string>('');
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intent-and-id'],
  });
  const { register, control, handleSubmit } = useForm<NewExampleForm>({
    mode: 'onChange',
  });

  const handleNewExample = handleSubmit((data) => {
    data.intentName = !isNewIntent ? selectedIntent : intentName;
    onSubmitExample(data);
  });

  return (
    <Dialog
      title={t('training.mba.addExamples')}
      onClose={() => setMessage(null)}
      footer={
        <>
          <Button appearance="secondary" onClick={() => setMessage(null)}>
            {t('global.cancel')}
          </Button>
          <Button onClick={handleNewExample}>{t('global.save')}</Button>
        </>
      }
    >
      <Track direction="vertical" gap={16} align="left">
        <FormInput
          {...register('example')}
          label={t('training.intents.example')}
          defaultValue={message.content || ''}
        />
        {intents && !isNewIntent && (
          <Controller
            disabled={true}
            name="intent"
            control={control}
            render={({ field }) => (
              <div className="multiSelect">
                <label className="multiSelect__label">{t('training.mba.intent')}</label>
                <div className="multiSelect__wrapper">
                  <Select
                    options={intents.map((intent) => ({ label: intent.intent ?? '', value: String(intent.id) }))}
                    placeholder={t('global.choose')}
                    onChange={(selected) => {
                      setSelectedIntent(selected?.value ?? '');
                      field.onChange(selected);
                    }}
                  />
                </div>
              </div>
            )}
          />
        )}
        <Controller
          name="newIntent"
          control={control}
          render={({ field }) => (
            <Switch
              {...field}
              label={t('training.newIntent')}
              onLabel={t('global.yes') || ''}
              offLabel={t('global.no') || ''}
              onCheckedChange={(checked) => {
                setIsNewIntent(checked);
                field.onChange(checked);
              }}
            />
          )}
        />
        {isNewIntent && (
          <FormInput
            {...register('intentName')}
            value={intentName}
            label={t('training.intentName')}
            onChange={(e) => {
              const value = e.target.value;
              const hasSpecialCharacters = /[^\p{L}\p{N} ]/u;
              if (!hasSpecialCharacters.test(value) && !value.startsWith(' ')) {
                setIntentName(value);
              }
            }}
          />
        )}
      </Track>
    </Dialog>
  );
};

export default NewExampleModal;
