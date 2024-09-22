const { searchNotification, findChatIdOrder } = require('./openSearch');
const { serverConfig } = require('./config');

function buildNotificationSearchInterval({ 
  channelId,
  interval = serverConfig.refreshInterval,
 }) {
  return ({ connectionId, sender }) => {
    const intervalHandle = setInterval(() => 
      searchNotification({
        connectionId,
        channelId,
        sender,
      }),
      interval
    );

    return () => clearInterval(intervalHandle);
  };
}

module.exports = {
  buildNotificationSearchInterval
};
