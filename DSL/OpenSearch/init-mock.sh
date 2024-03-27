#!/bin/bash

URL="http://localhost:9200"
AUTH="admin:admin"

#clear
curl -XDELETE '$URL/*' -u "$AUTH" --insecure

#responses
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/responses" -ku "$AUTH" --data-binary "@fieldMappings/responses.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/responses/_bulk" -ku "$AUTH" --data-binary "@mock/responses.json"
curl -L -X POST "$URL/_scripts/response-with-name-and-text" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/response-with-name-and-text.json"

#intents
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/intents" -ku "$AUTH" --data-binary "@fieldMappings/intents.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/intents/_bulk" -ku "$AUTH" --data-binary "@mock/intents.json"
curl -L -X POST "$URL/_scripts/intent-with-name" -H 'Content-Type: application/json' --data-binary "@templates/intent-with-name.json"
curl -L -X POST "$URL/_scripts/intents-with-examples-count" -H 'Content-Type: application/json' --data-binary "@templates/intents-with-examples-count.json"

#rules
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/rules" -ku "$AUTH" --data-binary "@fieldMappings/rules.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/rules/_bulk" -ku "$AUTH" --data-binary "@mock/rules.json"
curl -L -X POST "$URL/_scripts/rule-with-name" -H 'Content-Type: application/json' --data-binary "@templates/rule-with-name.json"
curl -L -X POST "$URL/_scripts/rule-with-forms" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-forms.json"
curl -L -X POST "$URL/_scripts/rule-with-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-responses.json"
curl -L -X POST "$URL/_scripts/rule-with-slots" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-slots.json"

#stories
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/stories" -ku "$AUTH" --data-binary "@fieldMappings/stories.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/stories/_bulk" -ku "$AUTH" --data-binary "@mock/stories.json"
curl -L -X POST "$URL/_scripts/story-with-name" -H 'Content-Type: application/json' --data-binary "@templates/story-with-name.json"
curl -L -X POST "$URL/_scripts/story-with-forms" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-forms.json"
curl -L -X POST "$URL/_scripts/story-with-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-responses.json"
curl -L -X POST "$URL/_scripts/story-with-slots" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-slots.json"

#Test stories
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/test-stories" -ku "$AUTH" --data-binary "@fieldMappings/test-stories.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/test-stories/_bulk" -ku "$AUTH" --data-binary "@mock/test-stories.json"
curl -L -X POST "$URL/_scripts/test-story-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/test-story-with-name.json"

#Forms
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/forms" -ku "$AUTH" --data-binary "@fieldMappings/forms.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/forms/_bulk" -ku "$AUTH" --data-binary "@mock/forms.json"
curl -L -X POST "$URL/_scripts/form-with-slot" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/form-with-slot.json"

#Entities
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/entities" -ku "$AUTH" --data-binary "@fieldMappings/entities.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/entities/_bulk" -ku "$AUTH" --data-binary "@mock/entities.json"
curl -L -X POST "$URL/_scripts/entity-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entity-with-name.json"
curl -L -X POST "$URL/_scripts/entities-with-examples" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entities-with-examples.json"

#Regexes
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/regexes" -ku "$AUTH" --data-binary "@fieldMappings/regexes.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/regexes/_bulk" -ku "$AUTH" --data-binary "@mock/regexes.json"
curl -L -X POST "$URL/_scripts/regex-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/regex-with-name.json"

#Examples entities
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/examples-entities" -ku "$AUTH" --data-binary "@fieldMappings/examples-entities.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/examples-entities/_bulk" -ku "$AUTH" --data-binary "@mock/examples-entities.json"

#Slots
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/slots" -ku "$AUTH" --data-binary "@fieldMappings/slots.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/slots/_bulk" -ku "$AUTH" --data-binary "@mock/slots.json"
