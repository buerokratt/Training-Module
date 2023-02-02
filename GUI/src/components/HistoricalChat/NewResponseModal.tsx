import { FC } from 'react';
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
  const { data: responses } = useQuery<Responses>({
    queryKey: ['responses'],
  });
  const { register, control, handleSubmit } = useForm<{ name: string; text: string; }>({
    mode: 'onChange',
  });

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
                onSelectionChange={(selection) => field.onChange(selection)}
                label={t('training.mba.intent')}
                options={Object.keys(responses).map((r) => ({ label: r, value: responses[r].text }))}
              />
            )}
          />
        )}
      </Track>
    </Dialog>
  );
};

export default NewResponseModal;
