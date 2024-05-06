import { FC } from 'react';
import { Message } from 'types/message';
import { getChatEventMessage } from 'utils/get-chat-event-message';
import './HistoricalChat.scss';

type ChatEventProps = {
  message: Message;
};

const ChatEvent: FC<ChatEventProps> = ({ message }) => (
  <div className="historical-chat__event-message">
    <p>{getChatEventMessage(message)}</p>
  </div>
);

export default ChatEvent;
