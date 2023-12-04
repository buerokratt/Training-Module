import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';

import { ReactComponent as BykLogoWhite } from 'assets/logo-white.svg';
import { Chat as ChatType } from 'types/chat';
import { Message } from 'types/message';
import { useToast } from 'hooks/useToast';
import { addExampleFromHistory} from 'services/intents';
import { editResponse } from 'services/responses';
import ChatMessage from './ChatMessage';
import ChatEvent from './ChatEvent';
import NewExampleModal from './NewExampleModal';
import NewResponseModal from './NewResponseModal';
import './HistoricalChat.scss';

type ChatProps = {
  chat: ChatType;
}

type GroupedMessage = {
  name: string;
  type: string;
  messages: Message[];
}

type NewResponse = {
  name: string;
  text: string;
}

const HistoricalChat: FC<ChatProps> = ({ chat }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const chatRef = useRef<HTMLDivElement>(null);
  const [markedMessage, setMarkedMessage] = useState<Message | null>(null);
  const [messageGroups, setMessageGroups] = useState<GroupedMessage[]>([]);
  const { data: messages } = useQuery<Message[]>({
    queryKey: [`cs-get-messages-by-chat-id/${chat.id}`],
  });

  const addExamplesMutation = useMutation({
    mutationFn: (data: {
      example: string;
      intent: string;
      newIntent: boolean;
      intentName?: string;
    }) => addExampleFromHistory(data.intent, { example: data.example }),
    onSuccess: async () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New example added',
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
      const newResponseData = {
        ...data,
        name: 'utter_' + data.name,
      };
      return editResponse(newResponseData.name, newResponseData.text, false);
    },
    onSuccess: async () => {
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'New response added',
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

  const endUserFullName = chat.endUserFirstName !== '' && chat.endUserLastName !== ''
    ? `${chat.endUserFirstName} ${chat.endUserLastName}` : t('global.anonymous');

  useEffect(() => {
    if (!messages) return;
    let groupedMessages: GroupedMessage[] = [];
    messages.forEach((message) => {
      const lastGroup = groupedMessages[groupedMessages.length - 1];
      if (lastGroup?.type === message.authorRole) {
        if (!message.event || message.event === 'greeting') {
          lastGroup.messages.push(message);
        } else {
          groupedMessages.push({
            name: '',
            type: 'event',
            messages: [message],
          });
        }
      } else {
        if (!message.event || message.event === 'greeting') {
          groupedMessages.push({
            name: message.authorRole === 'end-user'
              ? endUserFullName
              : message.authorRole === 'backoffice-user'
                ? `${message.authorFirstName} ${message.authorLastName}`
                : message.authorRole,
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
      }
    });
    setMessageGroups(groupedMessages);
  }, [messages, endUserFullName]);

  useEffect(() => {
    if (!chatRef.current || !messageGroups) return;
    chatRef.current.scrollIntoView({ block: 'end', inline: 'end' });
  }, [messageGroups]);

  return (
    <>
      <div className='historical-chat'>
        <div className='historical-chat__body'>
          <div className='historical-chat__group-wrapper'>
            {messageGroups && messageGroups.map((group, index) => (
              <div className={clsx(['historical-chat__group', `historical-chat__group--${group.type}`])}
                   key={`group-${index}`}>
                {group.type === 'event' ? (
                  <ChatEvent message={group.messages[0]} />
                ) : (
                  <>
                    <div className='historical-chat__group-initials'>
                      {group.type === 'buerokratt' || group.type === 'chatbot' ? (
                        <BykLogoWhite height={24} />
                      ) : (
                        <>{group.name.split(' ').map((n) => n[0]).join('').toUpperCase()}</>
                      )}
                    </div>
                    <div className='historical-chat__group-name'>{group.name}</div>
                    <div className='historical-chat__messages'>
                      {group.messages.map((message, i) => (
                        <ChatMessage
                          message={message}
                          key={`message-${i}`}
                          onMessageClick={(message) => setMarkedMessage(message)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
            <div id='anchor' ref={chatRef}></div>
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
