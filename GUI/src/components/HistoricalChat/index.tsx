import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';

import { ReactComponent as BykLogoWhite } from 'assets/logo-white.svg';
import { BACKOFFICE_NAME, Chat as ChatType } from 'types/chat';
import { Message } from 'types/message';
import { useToast } from 'hooks/useToast';
import { addExampleFromHistory, addIntentWithExample } from 'services/intents';
import { editResponse } from 'services/responses';
import ChatMessage from './ChatMessage';
import ChatEvent from './ChatEvent';
import NewExampleModal from './NewExampleModal';
import NewResponseModal from './NewResponseModal';
import './HistoricalChat.scss';
import { api } from '../../services/api';

type ChatProps = {
  chat: ChatType;
  trigger: boolean;
};

type GroupedMessage = {
  name: string;
  type: string;
  messages: Message[];
};

type NewResponse = {
  name: string;
  text: string;
};

const HistoricalChat: FC<ChatProps> = ({ chat, trigger }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const chatRef = useRef<HTMLDivElement>(null);
  const [markedMessage, setMarkedMessage] = useState<Message | null>(null);
  const [messageGroups, setMessageGroups] = useState<GroupedMessage[]>([]);
  const [messagesList, setMessagesList] = useState<Message[]>([]);

  useEffect(() => {
    getMessages();
  }, [trigger]);

  const getMessages = async () => {
    const { data: res } = await api.post('agents/messages-by-id', {
      chatId: chat.id,
    });
    setMessagesList(res.response);
  };

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


  const getUserName = (message: Message) => {
    const endUserFullName = chat.endUserFirstName !== '' && chat.endUserLastName !== ''
      ? `${chat.endUserFirstName} ${chat.endUserLastName}`
      : t('global.anonymous');

    if(message.authorRole === 'end-user')
      return endUserFullName;
    if(message.authorRole === 'backoffice-user')
      return `${message.authorFirstName} ${message.authorLastName}`;
    if (message.authorRole === 'buerokratt')
      return BACKOFFICE_NAME.DEFAULT;
    return message.authorRole;
  }

  useEffect(() => {
    if (!messagesList) return;
    let groupedMessages: GroupedMessage[] = [];
    messagesList.forEach((message) => {
      message.event = message.event?.toLowerCase();
      const lastGroup = groupedMessages[groupedMessages.length - 1];
      const isAMessageEvent =
        !message.event ||
        message.event.toLowerCase() === 'greeting' ||
        message.event.toLowerCase() === 'waiting_validation' ||
        message.event.toLowerCase() === 'approved_validation';
      if (lastGroup?.type === message.authorRole && isAMessageEvent) {
        lastGroup.messages.push(message);
      } else if (isAMessageEvent) {
        groupedMessages.push({
          name: getUserName(message),
          type: message.authorRole,
          messages: [message],
        });
      } else {
        groupedMessages.push({
          name: '',
          type: 'event',
          messages: [message],
        });
      }
    });
    setMessageGroups(groupedMessages);
  }, [messagesList]);

  useEffect(() => {
    if (!chatRef.current || !messageGroups) return;
    chatRef.current.scrollIntoView({ block: 'end', inline: 'end' });
  }, [messageGroups]);

  return (
    <>
      <div className="historical-chat">
        <div className="historical-chat__body">
          <div className="historical-chat__group-wrapper">
            {messageGroups?.map((group) => (
                <div
                  className={clsx([
                    'historical-chat__group',
                    `historical-chat__group--${group.type}`,
                  ])}
                  key={`group-${group.type}-${group.name}`}
                >
                  {group.type === 'event' ? (
                    <ChatEvent message={group.messages[0]} />
                  ) : (
                    <>
                      <div className="historical-chat__group-initials">
                        {group.type === 'buerokratt' ||
                        group.type === 'chatbot' ? (
                          <BykLogoWhite height={24} />
                        ) : (
                          <>
                            {group.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </>
                        )}
                      </div>
                      <div className="historical-chat__group-name">
                        {group.name}
                      </div>
                      <div className="historical-chat__messages">
                        {group.messages.map((message, i) => (
                          <ChatMessage
                            message={message}
                            key={`message-${message.id}-${message.created}-${message.authorTimestamp}`}
                            onMessageClick={(message) =>
                              setMarkedMessage(message)
                            }
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            <div id="anchor" ref={chatRef}></div>
          </div>
        </div>
      </div>

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

export default HistoricalChat;
