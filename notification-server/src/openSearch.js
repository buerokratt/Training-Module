const { Client } = require("@opensearch-project/opensearch");
const { openSearchConfig } = require("./config");

let client = buildClient();

async function searchNotification({ channelId, connectionId, sender }) {
  try {
    const response = await client.search({
      index: openSearchConfig.notificationIndex,
      body: {
        query: {
          bool: {
            must: { match: { channelId } },
            must_not: { match: { sentTo: connectionId } },
          },
        },
        sort: { timestamp: { order: "asc" } },
      },
    }).catch(handleError);;

    for (const hit of response.body.hits.hits) {
      await sender(hit._source.payload);
      await markAsSent(hit, connectionId);
    }
  } catch (e) {
    console.error(e);
    await sender({});
  }
}

async function markAsSent({ _index, _id }, connectionId) {
  await client.update({
    index: _index,
    id: _id,
    retry_on_conflict: openSearchConfig.retry_on_conflict,
    body: {
      script: {
        source: `if (ctx._source.sentTo == null) {
          ctx._source.sentTo = [params.connectionId];
        } else {
          ctx._source.sentTo.add(params.connectionId);
        }`,
        lang: "painless",
        params: { connectionId },
      },
    },
  });
}

function buildClient() {
  return new Client({
    node: openSearchConfig.getUrl(),
    ssl: openSearchConfig.ssl,
  });
}

function handleError(e) {
  if(e.name === 'ConnectionError')
    client = buildClient();
  throw e;
}

module.exports = {
  searchNotification
};
