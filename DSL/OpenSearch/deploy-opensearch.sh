#!/bin/bash

URL=$1
AUTH=$2
MOCK_ALLOWED=${3:-false}

if [[ -z $URL || -z $AUTH ]]; then
  echo "Url and Auth are required"
  exit 1
fi

# responses
curl -XDELETE "$URL/responses?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/responses" -ku "$AUTH" --data-binary "@fieldMappings/responses.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/responses/_bulk" -ku "$AUTH" --data-binary "@mock/responses.json"; fi
curl -L -X POST "$URL/_scripts/response-with-name-and-text" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/response-with-name-and-text.json"
curl -L -X POST "$URL/_scripts/response" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/response.json"
curl -L -X POST "$URL/_scripts/responses-with-pagination" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/responses-with-pagination.json"

# intents
curl -XDELETE "$URL/intents?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/intents" -ku "$AUTH" --data-binary "@fieldMappings/intents.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/intents/_bulk" -ku "$AUTH" --data-binary "@mock/intents.json"; fi
curl -L -X POST "$URL/_scripts/intent-with-name" -H 'Content-Type: application/json' --data-binary "@templates/intent-with-name.json"
curl -L -X POST "$URL/_scripts/intents-with-examples-count" -H 'Content-Type: application/json' --data-binary "@templates/intents-with-examples-count.json"
curl -L -X POST "$URL/_scripts/intents-with-pagination" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/intents-with-pagination.json"

# rules
curl -XDELETE "$URL/rules?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/rules" -ku "$AUTH" --data-binary "@fieldMappings/rules.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/rules/_bulk" -ku "$AUTH" --data-binary "@mock/rules.json"; fi
curl -L -X POST "$URL/_scripts/rule-with-name" -H 'Content-Type: application/json' --data-binary "@templates/rule-with-name.json"
curl -L -X POST "$URL/_scripts/rule-with-forms" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-forms.json"
curl -L -X POST "$URL/_scripts/rule-with-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-responses.json"
curl -L -X POST "$URL/_scripts/rule-with-slots" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-slots.json"
curl -L -X POST "$URL/_scripts/rules-by-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rules-by-responses.json"
curl -L -X POST "$URL/_scripts/rule-by-intent" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-by-intent.json"
curl -L -X POST "$URL/_scripts/rules-with-pagination" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rules-with-pagination.json"

# stories
curl -XDELETE "$URL/stories?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/stories" -ku "$AUTH" --data-binary "@fieldMappings/stories.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/stories/_bulk" -ku "$AUTH" --data-binary "@mock/stories.json"; fi
curl -L -X POST "$URL/_scripts/story-with-name" -H 'Content-Type: application/json' --data-binary "@templates/story-with-name.json"
curl -L -X POST "$URL/_scripts/story-with-forms" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-forms.json"
curl -L -X POST "$URL/_scripts/story-with-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-responses.json"
curl -L -X POST "$URL/_scripts/story-with-slots" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-slots.json"
curl -L -X POST "$URL/_scripts/stories-by-responses" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/stories-by-responses.json"

# test-stories
curl -XDELETE "$URL/test-stories?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/test-stories" -ku "$AUTH" --data-binary "@fieldMappings/test-stories.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/test-stories/_bulk" -ku "$AUTH" --data-binary "@mock/test-stories.json"; fi
curl -L -X POST "$URL/_scripts/test-story-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/test-story-with-name.json"

# forms
curl -XDELETE "$URL/forms?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/forms" -ku "$AUTH" --data-binary "@fieldMappings/forms.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/forms/_bulk" -ku "$AUTH" --data-binary "@mock/forms.json"; fi
curl -L -X POST "$URL/_scripts/form-with-slot" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/form-with-slot.json"

# entities
curl -XDELETE "$URL/entities?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/entities" -ku "$AUTH" --data-binary "@fieldMappings/entities.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/entities/_bulk" -ku "$AUTH" --data-binary "@mock/entities.json"; fi
curl -L -X POST "$URL/_scripts/entity-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entity-with-name.json"
curl -L -X POST "$URL/_scripts/entities-with-examples" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entities-with-examples.json"

# regexes
curl -XDELETE "$URL/regexes?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/regexes" -ku "$AUTH" --data-binary "@fieldMappings/regexes.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/regexes/_bulk" -ku "$AUTH" --data-binary "@mock/regexes.json"; fi
curl -L -X POST "$URL/_scripts/regex-with-name" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/regex-with-name.json"
curl -L -X POST "$URL/_scripts/regexes-with-pagination" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/regexes-with-pagination.json"

# examples-entities
curl -XDELETE "$URL/examples-entities?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/examples-entities" -ku "$AUTH" --data-binary "@fieldMappings/examples-entities.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/examples-entities/_bulk" -ku "$AUTH" --data-binary "@mock/examples-entities.json"; fi

#Slots
curl -XDELETE "$URL/slots?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/slots" -ku "$AUTH" --data-binary "@fieldMappings/slots.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/slots/_bulk" -ku "$AUTH" --data-binary "@mock/slots.json"; fi

# Domain
curl -XDELETE "$URL/domain?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/domain" -ku "$AUTH" --data-binary "@fieldMappings/domain.json"
curl -L -X POST "$URL/_scripts/domain-objects-with-pagination" -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/domain-objects-with-pagination.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/domain/_bulk" -ku "$AUTH" --data-binary "@mock/domain.json"; fi

#Config
curl -XDELETE "$URL/config?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/config" -ku "$AUTH" --data-binary "@fieldMappings/config.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/config/_bulk" -ku "$AUTH" --data-binary "@mock/config.json"; fi

# Notifications
curl -XDELETE "$URL/notifications?ignore_unavailable=true" -u "$AUTH" --insecure
curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/notifications" -ku "$AUTH" --data-binary "@fieldMappings/notifications.json"
if $MOCK_ALLOWED; then curl -H "Content-Type: application/x-ndjson" -X PUT "$URL/notifications/_bulk" -ku "$AUTH" --data-binary "@mock/notifications.json"; fi
