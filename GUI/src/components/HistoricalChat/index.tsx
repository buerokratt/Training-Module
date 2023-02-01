import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import { Button, Dialog, FormInput, FormSelect, Track } from 'components';
import { ReactComponent as BykLogoWhite } from 'assets/logo-white.svg';
import { Chat as ChatType } from 'types/chat';
import { Message } from 'types/message';
import { Intent } from 'types/intent';
import ChatMessage from './ChatMessage';
import ChatEvent from './ChatEvent';
import './HistoricalChat.scss';

type ChatProps = {
  chat: ChatType;
}

type GroupedMessage = {
  name: string;
  type: string;
  messages: Message[];
}

const HistoricalChat: FC<ChatProps> = ({ chat }) => {
  const { t } = useTranslation();
  const chatRef = useRef<HTMLDivElement>(null);
  const [markedMessage, setMarkedMessage] = useState<Message | null>(null);
  const [messageGroups, setMessageGroups] = useState<GroupedMessage[]>([]);
  const { data: messages } = useQuery<Message[]>({
    queryKey: [`cs-get-messages-by-chat-id/${chat.id}`],
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
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
        groupedMessages.push({
          name: message.authorRole === 'end-user'
            ? endUserFullName
            : message.authorRole === 'backoffice-user'
              ? `${message.authorFirstName} ${message.authorLastName}`
              : message.authorRole,
          type: message.authorRole,
          messages: [message],
        });
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
                        <ChatMessage message={message} key={`message-${i}`} onMessageClick={(message) => setMarkedMessage(message)} />
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
        // TODO: Modify modal with correct data
        <Dialog
          title='Euismod Egestas Elit'
          onClose={() => setMarkedMessage(null)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setMarkedMessage(null)}>
                {t('global.cancel')}
              </Button>
              <Button>{t('global.save')}</Button>
            </>
          }
        >
          <Track direction='vertical' gap={16}>
            <FormInput label='Nullam Ullamcorper' name='test1' defaultValue={markedMessage.content} />
            {intents && (
              <FormSelect
                label='Etiam Vestibulum'
                name='test2'
                options={intents.map((intent) => ({ label: intent.intent, value: String(intent.id) }))}
              />
            )}
          </Track>
        </Dialog>
      )}
    </>
  );
};

export default HistoricalChat;
