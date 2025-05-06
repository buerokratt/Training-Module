import React, { FC, useState } from 'react';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import { useToast } from '../../../hooks/useToast';
import useStore from '../../../store/store';
import { ChatHistory } from '@buerokratt-ria/common-gui-components';
import { Message } from 'types/message';
import NewExampleModal from 'components/HistoricalChat/NewExampleModal';
import NewResponseModal from 'components/HistoricalChat/NewResponseModal';
import { useMutation } from '@tanstack/react-query';
import { addExampleFromHistory, addIntentWithExample } from 'services/intents';
import { useTranslation } from 'react-i18next';
import { editResponse } from 'services/responses';
import { AxiosError } from 'axios';

type NewResponse = {
  name: string;
  text: string;
};

const History: FC = () => {
  const [markedMessage, setMarkedMessage] = useState<Message | null>(null);
  const { t } = useTranslation();
  const toast = useToast();
  
  const addExamplesMutation = useMutation({
      mutationFn: (data: {
        example: string;
        intent: string;
        newIntent: boolean;
        intentName?: string;
      }) => {
        if (data.newIntent) {
          return addIntentWithExample({
            intentName: data.intentName ?? '',
            newExamples: data.example,
          });
        }
        return addExampleFromHistory(data.intentName ?? '', {
          example: data.example,
        });
      },
      onSuccess: async () => {
        toast.open({
          type: 'success',
          title: t('global.notification'),
          message: t('toast.newExampleAdded'),
        });
      },
      onError: (error: AxiosError) => {
        toast.open({
          type: 'error',
          title: t('global.notificationError'),
          message: error.message,
        });
      },
      onSettled: () => setMarkedMessage(null),
    });
  
    const addResponseMutation = useMutation({
      mutationFn: (data: NewResponse) => {
        const validName = validateName(data.name);
        const newResponseData = {
          ...data,
          name: 'utter_' + validName,
        };
        return editResponse(newResponseData.name, newResponseData.text, false);
      },
      onSuccess: async () => {
        toast.open({
          type: 'success',
          title: t('global.notification'),
          message: t('toast.newResponseAdded'),
        });
      },
      onError: (error: AxiosError) => {
        toast.open({
          type: 'error',
          title: t('global.notificationError'),
          message: error.message,
        });
      },
      onSettled: () => setMarkedMessage(null),
    });
  
    const validateName = (name: string) => {
      if (name && name.trim().length !== 0) {
        return name.trim().replace(/\s/g, '_');
      }
      return '';
    };

  return (
    <>
      <ChatHistory
        toastContext={useToast()}
        user={useStore.getState().userInfo}
        showComment={false}
        showEmail={import.meta.env.REACT_APP_SHOW_HISTORY_EMAIL === 'true'}
        showSortingLabel={import.meta.env.REACT_APP_SHOW_HISTORY_SORTING === 'true'}
        showStatus={false}
        onMessageClick={(message: Message) => {
          setMarkedMessage(message);
        }}
      />
      {markedMessage && (
        <>
          {markedMessage.authorRole === 'end-user' && (
            <NewExampleModal
              message={markedMessage}
              setMessage={setMarkedMessage}
              onSubmitExample={(data) => addExamplesMutation.mutate(data)}
            />
          )}
          {markedMessage.authorRole === 'backoffice-user' && (
            <NewResponseModal
              message={markedMessage}
              setMessage={setMarkedMessage}
              onSubmitResponse={(data) => addResponseMutation.mutate(data)}
            />
          )}
        </>
      )}
    </>
  );
};

export default withAuthorization(History, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
