import { createColumnHelper } from "@tanstack/react-table";
import { Chat as ChatType, CHAT_STATUS } from 'types/chat';
import { format } from 'date-fns';
import i18n from "../../../../i18n";
import { Button, Icon, Tooltip } from "components";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export const getColumns = ({
  copyValueToClipboard,
  setSelectedChat,
}:{
  copyValueToClipboard: (value: string) => Promise<void>,
  setSelectedChat: (chat: ChatType) => void,
}) => {
  const columnHelper = createColumnHelper<ChatType>();

  const getStatus = (original: ChatType, status: CHAT_STATUS) => {
    if(status !== CHAT_STATUS.ENDED)
      return '';
    if (original.lastMessageEvent != null && original.lastMessageEvent !== 'message-read')
      return i18n.t('chat.plainEvents.' + original.lastMessageEvent);
    return i18n.t('chat.status.ended');
  }

  return [
    columnHelper.accessor('created', {
      id: 'created',
      header: i18n.t('chat.history.startTime') || '',
      cell: (props) =>
        format(
          new Date(props.getValue()),
          'dd.MM.yyyy HH:mm:ss',
          i18n.language === 'et' ? { locale: et } : undefined
        ),
    }),
    columnHelper.accessor('ended', {
      id: 'ended',
      header: i18n.t('chat.history.endTime') || '',
      cell: (props) =>
        format(
          new Date(props.getValue()),
          'dd.MM.yyyy HH:mm:ss',
          i18n.language === 'et' ? { locale: et } : undefined
        ),
    }),
    columnHelper.accessor('customerSupportDisplayName', {
      id: 'customerSupportDisplayName',
      header: i18n.t('chat.history.csaName') || '',
    }),
    columnHelper.accessor(
      (row) => `${row.endUserFirstName} ${row.endUserLastName}`,
      {
        id: `endUserName`,
        header: i18n.t('global.name') || '',
      }
    ),
    columnHelper.accessor('endUserId', {
      id: 'endUserId',
      header: i18n.t('global.idCode') || '',
    }),
    columnHelper.accessor('contactsMessage', {
      header: i18n.t('chat.history.contact') || '',
      cell: (props) => (props.getValue() ? i18n.t('global.yes') : i18n.t('global.no')),
    }),
    columnHelper.accessor('comment', {
      id: 'comment',
      header: i18n.t('chat.history.comment') || '',
      cell: (props) =>
        !props.getValue() ? (
          <></>
        ) : (
          <Tooltip content={props.getValue()}>
            <span
              onClick={() => copyValueToClipboard(props.getValue())}
              style={{ cursor: 'pointer' }}
            >
              {props.getValue() === undefined
                ? ''
                : props.getValue()?.slice(0, 30) + '...'}
            </span>
          </Tooltip>
        ),
    }),
    columnHelper.accessor('labels', {
      header: i18n.t('chat.history.label') || '',
      cell: () => <span></span>,
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: i18n.t('global.status') || '',
      cell: (props) => getStatus(props.row.original, props.getValue()),
      sortingFn: (a, b, isAsc) => {
        const statusA =
          a.getValue('status') === CHAT_STATUS.ENDED
            ? i18n.t('chat.plainEvents.' + a.original.lastMessageEvent)
            : '';
        const statusB =
          b.getValue('status') === CHAT_STATUS.ENDED
            ? i18n.t('chat.plainEvents.' + b.original.lastMessageEvent)
            : '';
        return (
          statusA.localeCompare(statusB, undefined, {
            numeric: true,
            sensitivity: 'base',
          }) * (isAsc ? 1 : -1)
        );
      },
    }),
    columnHelper.accessor('id', {
      id: 'id',
      header: 'ID',
      cell: (props: any) => (
        <Tooltip content={props.getValue()}>
          <span
            onClick={() => copyValueToClipboard(props.getValue())}
            style={{ cursor: 'pointer' }}
          >
            {props.getValue().split('-')[0]}
          </span>
        </Tooltip>
      ),
    }),
    columnHelper.display({
      id: 'detail',
      cell: (props) => (
        <Button
          appearance="text"
          onClick={() => setSelectedChat(props.row.original)}
        >
          <Icon icon={<MdOutlineRemoveRedEye color={'rgba(0,0,0,0.54)'} />} />
          {i18n.t('global.view')}
        </Button>
      ),
      meta: {
        size: '1%',
      },
    }),
  ]
}
