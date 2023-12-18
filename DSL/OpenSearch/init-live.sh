#!/bin/bash

HOST="http://localhost"
PORT="9200"
AUTH="admin:admin"  # Replace with your actual authentication

# Clear existing indices
curl -XDELETE "$HOST:$PORT/*" -u "$AUTH" --insecure

# responses
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/responses" -ku "$AUTH" --data-binary "@fieldMappings/responses.json"
curl -L -X POST "$HOST:$PORT/_scripts/response-with-name-and-text" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/response-with-name-and-text.json"

# intents
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/intents" -ku "$AUTH" --data-binary "@fieldMappings/intents.json"
curl -L -X POST "$HOST:$PORT/_scripts/intent-with-name" -H 'Content-Type: application.json' --data-binary "@templates/intent-with-name.json"
curl -L -X POST "$HOST:$PORT/_scripts/intents-with-examples-count" -H 'Content-Type: application/json' --data-binary "@templates/intents-with-examples-count.json"

# rules
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/rules" -ku "$AUTH" --data-binary "@fieldMappings/rules.json"
curl -L -X POST "$HOST:$PORT/_scripts/rule-with-name" -H 'Content-Type: application/json' --data-binary "@templates/rule-with-name.json"
curl -L -X POST "$HOST:$PORT/_scripts/rule-with-forms" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-forms.json"
curl -L -X POST "$HOST:$PORT/_scripts/rule-with-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-responses.json"
curl -L -X POST "$HOST:$PORT/_scripts/rule-with-slots" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-slots.json"

# stories
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/stories" -ku "$AUTH" --data-binary "@fieldMappings/stories.json"
curl -L -X POST "$HOST:$PORT/_scripts/story-with-name" -H 'Content-Type: application/json' --data-binary "@templates/story-with-name.json"
curl -L -X POST "$HOST:$PORT/_scripts/story-with-forms" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-forms.json"
curl -L -X POST "$HOST:$PORT/_scripts/story-with-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-responses.json"
curl -L -X POST "$HOST:$PORT/_scripts/story-with-slots" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-slots.json"

# test-stories
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/test-stories" -ku "$AUTH" --data-binary "@fieldMappings/test-stories.json"
curl -L -X POST "$HOST:$PORT/_scripts/test-story-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/test-story-with-name.json"

# forms
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/forms" -ku "$AUTH" --data-binary "@fieldMappings/forms.json"
curl -L -X POST "$HOST:$PORT/_scripts/form-with-slot" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/form-with-slot.json"

# entities
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/entities" -ku "$AUTH" --data-binary "@fieldMappings/entities.json"
curl -L -X POST "$HOST:$PORT/_scripts/entity-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entity-with-name.json"
curl -L -X POST "$HOST:$PORT/_scripts/entities-with-examples" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entities-with-examples.json"

# regexes
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/regexes" -ku "$AUTH" --data-binary "@fieldMappings/regexes.json"
curl -L -X POST "$HOST:$PORT/_scripts/regex-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/regex-with-name.json"

# examples-entities
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/examples-entities" -ku "$AUTH" --data-binary "@fieldMappings/examples-entities.json"

#Slots
curl -H "Content-Type: application/x-ndjson" -X PUT "$HOST:$PORT/slots" -ku "$AUTH" --data-binary "@fieldMappings/slots.json"
