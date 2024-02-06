import {FC, useState} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Button, Dialog, FormInput, FormSelect, Track } from 'components';
import { Message } from 'types/message';
import { Responses } from 'types/response';

type NewResponseModalProps = {
  message: Message;
  setMessage: (payload: Message | null) => void;
  onSubmitResponse: (data: { name: string; text: string; }) => void;
}

const NewResponseModal: FC<NewResponseModalProps> = ({ message, setMessage, onSubmitResponse }) => {
  const { t } = useTranslation();
  const [selectedResponse, setSelectedResponse] = useState<string>('');
  const { data: responses } = useQuery<Responses>({
    queryKey: ['responses'],
  });
  const { register, control, handleSubmit } = useForm<{ name: string; text: string; }>({
    mode: 'onChange',
  });

  const mappedResponses = () => {
    if(responses && Object.keys(responses).length === 0) {
      return [];
    }
    // @ts-ignore
    return Object.keys(responses).map((r) => ({ label: responses[r].name, value: responses[r].response[0].text }))
  };

  const handleNewResponse = handleSubmit((data) => {
    onSubmitResponse(data);
  });

  return (
    <Dialog
      title={t('training.responses.addNewResponse')}
      onClose={() => setMessage(null)}
      footer={
        <>
          <Button appearance='secondary' onClick={() => setMessage(null)}>
            {t('global.cancel')}
          </Button>
          <Button onClick={handleNewResponse}>{t('global.save')}</Button>
        </>
      }
    >
      <Track direction='vertical' gap={16} align='left'>
        <FormInput {...register('name')} label={t('training.responses.title')} defaultValue={message.content} />
        {responses && (
          <Controller
            name='text'
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                onSelectionChange={(selection) => {
                  setSelectedResponse(selection?.value || '')
                  field.onChange(selection)
                }}
                label={t('training.mba.intent')}
                value={selectedResponse}
                options={mappedResponses()}
              />
            )}
          />
        )}
      </Track>
    </Dialog>
  );
};

export default NewResponseModal;
