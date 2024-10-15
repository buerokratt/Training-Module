import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Dialog, FormInput, Track } from 'components';
import { Message } from 'types/message';

type NewResponseModalProps = {
  message: Message;
  setMessage: (payload: Message | null) => void;
  onSubmitResponse: (data: { name: string; text: string; }) => void;
}

const NewResponseModal: FC<NewResponseModalProps> = ({ message, setMessage, onSubmitResponse }) => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<{ name: string; text: string; }>({
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
        <FormInput {...register('name',{
          required: t('submit.slotNameRequired').toString(),
          minLength: {
            value: 1,
            message: 'Name cant be empty'
          }})} label={'utter_'} />
        <FormInput {...register('text',{
          required: t('submit.slotNameRequired').toString(),
          minLength: {
            value: 1,
            message: 'Text cant be empty'
          }})} label={t('training.responses.response')} defaultValue={message.content || ''} />
      </Track>
    </Dialog>
  );
};

export default NewResponseModal;
