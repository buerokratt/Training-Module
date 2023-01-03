import { FC, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Conversation, Message } from 'types/conversation';
import { format } from 'date-fns';

import './Chat.scss';

type ChatProps = {
  conversationId: number;
}

const Chat: FC<ChatProps> = ({ conversationId }) => {
  const { data: conversation } = useQuery<Conversation>({
    queryKey: [`conversations/${conversationId}`],
  });

  const messageGroups = useMemo(() => {
    if (!conversation) return null;
    const groupedMessages: { name: string; messages: Message[] }[] = [];
    let lastName: string | null = null;
    let group: { name: string; messages: Message[] } | null = null;
    for (let message of conversation.messages) {
      if (lastName === null || lastName !== message.name) {
        group = {
          name: message.name,
          messages: [],
        };
        groupedMessages.push(group);
      }
      if (group) {
        group.messages.push(message);
      }
      lastName = message.name;
    }
    return groupedMessages;
  }, [conversation]);

  if (!conversation) return <>Loading...</>;

  return (
    <div className='chat'>
      {messageGroups && messageGroups.map((group, index) => (
        <div className='chat__group' key={`group-${index}`}>
          <div className='chat__group-initials'>
            {group.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
          <div className='chat__group-name'>{group.name}</div>
          <div className='chat__messages'>
            {group.messages.map((message, i) => (
              <div className='chat__message' key={`message-${i}`}>
                <div className='chat__message-text'>{message.message}</div>
                <time dateTime={message.sentAt} className='chat__message-date'>
                  {format(new Date(message.sentAt), 'HH:ii:ss')}
                </time>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
