import { FC } from 'react';
import { Message } from 'types/message';
import { getChatEventMessage } from 'utils/get-chat-event-message';
import './Chat.scss';

type ChatEventProps = {
  message: Message;
};

const ChatEvent: FC<ChatEventProps> = ({ message }) => (
  <div className="active-chat__event-message">
    <p>{getChatEventMessage(message)}</p>
  </div>
);

export default ChatEvent;
