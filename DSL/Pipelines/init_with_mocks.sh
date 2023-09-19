#!/bin/bash

MOCK=../../mock1

# intents
for file in $MOCK/data/nlu/* ; do
	curl -X POST localhost:3010/put/intents/intent --form input="`/bin/cat $file`" 
done

# rules
curl -X POST localhost:3010/bulk/rules/rule --form input="`/bin/cat $MOCK/data/rules.yml`" 

# stories
curl -X POST localhost:3010/bulk/stories/story --form input="`/bin/cat $MOCK/data/stories.yml`" 

#regexes
curl -X POST localhost:3010/put/intents/intent --form input="`/bin/cat $MOCK/data/regex_nlu.yml`" 	

#domain
curl -v -X POST localhost:3010/bulk/domain --form input=@$MOCK/domain.yml

#domain
curl -v -X POST localhost:3010/bulk/config --form input=@$MOCK/config.yml