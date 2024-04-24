import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Message } from 'types/message';
import { CHAT_EVENTS } from 'types/chat';
import { format } from 'date-fns';
import './Chat.scss';

type ChatEventProps = {
  message: Message;
};

const ChatEvent: FC<ChatEventProps> = ({ message }) => {
  const { t } = useTranslation();
  const {
    event,
    authorTimestamp,
    forwardedByUser,
    forwardedFromCsa,
    forwardedToCsa,
  } = message;

  let EVENT_PARAMS;

  switch (event) {
    case CHAT_EVENTS.REDIRECTED:
      {
        if (forwardedByUser === forwardedFromCsa) {
          EVENT_PARAMS = t('chat.redirectedMessageByOwner', {
            from: forwardedFromCsa,
            to: forwardedToCsa,
            date: format(new Date(authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
          });
        } else if (forwardedByUser === forwardedToCsa) {
          EVENT_PARAMS = t('chat.redirectedMessageClaimed', {
            from: forwardedFromCsa,
            to: forwardedToCsa,
            date: format(new Date(authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
          });
        } else {
          EVENT_PARAMS = t('chat.redirectedMessage', {
            user: forwardedByUser,
            from: forwardedFromCsa,
            to: forwardedToCsa,
            date: format(new Date(authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
          });
        }
      }
      break;
    case CHAT_EVENTS.ASSIGN_PENDING_CHAT_CSA:
      EVENT_PARAMS = t(`chat.event.${event?.toLowerCase()}`, {
        name: message.authorFirstName ?? 'CSA',
      });
      break;
    case CHAT_EVENTS.PENDING_USER_REACHED:
      EVENT_PARAMS = t(`chat.event.${event?.toLowerCase()}`, {
        name: message.authorFirstName ?? 'CSA',
      });
      break;
    case CHAT_EVENTS.PENDING_USER_NOT_REACHED:
      EVENT_PARAMS = t(`chat.event.${event?.toLowerCase()}`, {
        name: message.authorFirstName ?? 'CSA',
      });
      break;
    case CHAT_EVENTS.USER_AUTHENTICATED:
      EVENT_PARAMS = t(`chat.event.${event?.toLowerCase()}`, {
        name: `${message.authorFirstName ?? ''} ${
          message.authorLastName ?? ''
        }`,
        date: format(new Date(message.authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
      });
      break;
    default:
      EVENT_PARAMS = t(`chat.event.${event?.toLowerCase()}`, {
        date: format(new Date(authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
      });
      break;
  }

  return (
    <div className="active-chat__event-message">
      <p>{EVENT_PARAMS}</p>
    </div>
  );
};

export default ChatEvent;
