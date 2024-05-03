import { CHAT_EVENTS } from "types/chat";
import { Message } from "types/message";
import { format } from "util";
import i18n from "../../i18n";

export const getChatEventMessage = (message: Message) => {
  const {
    event,
    authorTimestamp,
    forwardedByUser,
    forwardedFromCsa,
    forwardedToCsa,
  } = message;

  switch (event) {
    case CHAT_EVENTS.REDIRECTED: {
      if (forwardedByUser === forwardedFromCsa) {
        return i18n.t('chat.redirectedMessageByOwner', {
          from: forwardedFromCsa,
          to: forwardedToCsa,
          date: format(new Date(authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
        });
      } else if (forwardedByUser === forwardedToCsa) {
        return i18n.t('chat.redirectedMessageClaimed', {
          from: forwardedFromCsa,
          to: forwardedToCsa,
          date: format(new Date(authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
        });
      } else {
        return i18n.t('chat.redirectedMessage', {
          user: forwardedByUser,
          from: forwardedFromCsa,
          to: forwardedToCsa,
          date: format(new Date(authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
        });
      }
    }
    case CHAT_EVENTS.ASSIGN_PENDING_CHAT_CSA:
    case CHAT_EVENTS.PENDING_USER_REACHED:
    case CHAT_EVENTS.PENDING_USER_NOT_REACHED:
      return i18n.t(`chat.event.${event?.toLowerCase()}`, {
        name: message.authorFirstName ?? 'CSA',
      });
    case CHAT_EVENTS.USER_AUTHENTICATED:
      return i18n.t(`chat.event.${event?.toLowerCase()}`, {
        name: `${message.authorFirstName ?? ''} ${
          message.authorLastName ?? ''
        }`,
        date: format(new Date(message.authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
      });
    default:
      return i18n.t(`chat.event.${event?.toLowerCase()}`, {
        date: format(new Date(authorTimestamp), 'dd.MM.yyyy HH:mm:ss'),
      });
  }
}
