#!/bin/bash
# to run it - ./init_with_mocks.sh <url:port>

MOCK=../DMapper/locations

PIPELINES=${1:-"localhost:3010"}

# intents
for file in $MOCK/data/nlu/* ; do
 curl -X POST $PIPELINES/put/intents/intent --form input=@$file
done
echo "intents done"
# rules
curl -X POST $PIPELINES/bulk/rules/rule --form input=@$MOCK/data/rules.yml
echo "rules done"
# stories
curl -X POST $PIPELINES/bulk/stories/story --form input=@$MOCK/data/stories.yml
echo "stories done"
#regexes
for file in $MOCK/data/regex/* ; do
 curl -X POST $PIPELINES/put/regexes/regex --form input=@$file
done
echo "regex done"
#domain
curl -v -X POST $PIPELINES/bulk/domain --form input=@$MOCK/data/domain.yml
echo "domain done"
#domain
curl -v -X POST $PIPELINES/bulk/config --form input=@$MOCK/data/config.yml
echo "config done"
