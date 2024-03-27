#!/bin/bash

URL="http://opensearch-node:9200"
AUTH="admin:admin"

# responses
curl -XDELETE "$URL/responses?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/responses" -ku "$AUTH" --data-binary "@fieldMappings/responses.json"
curl -L -X POST "$URL/_scripts/response-with-name-and-text" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/response-with-name-and-text.json"

# intents
curl -XDELETE "$URL/intents?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/intents" -ku "$AUTH" --data-binary "@fieldMappings/intents.json"
curl -L -X POST "$URL/_scripts/intent-with-name" -H 'Content-Type: application/json' --data-binary "@templates/intent-with-name.json"
curl -L -X POST "$URL/_scripts/intents-with-examples-count" -H 'Content-Type: application/json' --data-binary "@templates/intents-with-examples-count.json"

# rules
curl -XDELETE "$URL/rules?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/rules" -ku "$AUTH" --data-binary "@fieldMappings/rules.json"
curl -L -X POST "$URL/_scripts/rule-with-name" -H 'Content-Type: application/json' --data-binary "@templates/rule-with-name.json"
curl -L -X POST "$URL/_scripts/rule-with-forms" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-forms.json"
curl -L -X POST "$URL/_scripts/rule-with-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-responses.json"
curl -L -X POST "$URL/_scripts/rule-with-slots" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-slots.json"

# stories
curl -XDELETE "$URL/stories?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/stories" -ku "$AUTH" --data-binary "@fieldMappings/stories.json"
curl -L -X POST "$URL/_scripts/story-with-name" -H 'Content-Type: application/json' --data-binary "@templates/story-with-name.json"
curl -L -X POST "$URL/_scripts/story-with-forms" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-forms.json"
curl -L -X POST "$URL/_scripts/story-with-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-responses.json"
curl -L -X POST "$URL/_scripts/story-with-slots" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-slots.json"

# test-stories
curl -XDELETE "$URL/test-stories?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/test-stories" -ku "$AUTH" --data-binary "@fieldMappings/test-stories.json"
curl -L -X POST "$URL/_scripts/test-story-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/test-story-with-name.json"

# forms
curl -XDELETE "$URL/forms?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/forms" -ku "$AUTH" --data-binary "@fieldMappings/forms.json"
curl -L -X POST "$URL/_scripts/form-with-slot" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/form-with-slot.json"

# entities
curl -XDELETE "$URL/entities?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/entities" -ku "$AUTH" --data-binary "@fieldMappings/entities.json"
curl -L -X POST "$URL/_scripts/entity-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entity-with-name.json"
curl -L -X POST "$URL/_scripts/entities-with-examples" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entities-with-examples.json"

# regexes
curl -XDELETE "$URL/regexes?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/regexes" -ku "$AUTH" --data-binary "@fieldMappings/regexes.json"
curl -L -X POST "$URL/_scripts/regex-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/regex-with-name.json"

# examples-entities
curl -XDELETE "$URL/examples-entities?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/examples-entities" -ku "$AUTH" --data-binary "@fieldMappings/examples-entities.json"

#Slots
curl -XDELETE "$URL/slots?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/slots" -ku "$AUTH" --data-binary "@fieldMappings/slots.json"
