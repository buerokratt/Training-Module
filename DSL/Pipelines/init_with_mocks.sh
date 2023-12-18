#!/bin/bash

MOCK=../../mock1

# intents
for file in $MOCK/data/nlu/* ; do
 curl -X POST localhost:3010/put/intents/intent --form input=@$file
done

# rules
curl -X POST localhost:3010/bulk/rules/rule --form input=@$MOCK/data/rules.yml

# stories
curl -X POST localhost:3010/bulk/stories/story --form input=@$MOCK/data/stories.yml

#regexes
for file in $MOCK/data/regex/* ; do
 curl -X POST localhost:3010/put/regexes/regex --form input=@$file
done

#domain
curl -v -X POST localhost:3010/bulk/domain --form input=@$MOCK/domain.yml

#domain
curl -v -X POST localhost:3010/bulk/config --form input=@$MOCK/config.yml