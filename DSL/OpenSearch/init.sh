#clear
curl -XDELETE '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/*' -u admin:admin --insecure
#responses
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/responses" -ku admin:admin --data-binary "@fieldMappings/responses.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/responses/_bulk" -ku admin:admin --data-binary "@mock/responses.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/response-with-name-and-text' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/response-with-name-and-text.json"

#intents
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/intents" -ku admin:admin --data-binary "@fieldMappings/intents.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/intents/_bulk" -ku admin:admin --data-binary "@mock/intents.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/intent-with-name' -H 'Content-Type: application/json' --data-binary "@templates/intent-with-name.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/intents-with-examples-count' -H 'Content-Type: application/json' --data-binary "@templates/intents-with-examples-count.json"

#rules
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/rules" -ku admin:admin --data-binary "@fieldMappings/rules.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/rules/_bulk" -ku admin:admin --data-binary "@mock/rules.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/rule-with-name' -H 'Content-Type: application/json' --data-binary "@templates/rule-with-name.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/rule-with-forms' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-forms.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/rule-with-responses' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-responses.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/rule-with-slots' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-slots.json"

#stories
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/stories" -ku admin:admin --data-binary "@fieldMappings/stories.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/stories/_bulk" -ku admin:admin --data-binary "@mock/stories.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/story-with-name' -H 'Content-Type: application/json' --data-binary "@templates/story-with-name.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/story-with-forms' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-forms.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/story-with-responses' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-responses.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/story-with-slots' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-slots.json"

#Test stories
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/test-stories" -ku admin:admin --data-binary "@fieldMappings/test-stories.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/test-stories/_bulk" -ku admin:admin --data-binary "@mock/test-stories.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/test-story-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/test-story-with-name.json"

#Forms
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/forms" -ku admin:admin --data-binary "@fieldMappings/forms.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/forms/_bulk" -ku admin:admin --data-binary "@mock/forms.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/form-with-slot' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/form-with-slot.json"

#Entities
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/entities" -ku admin:admin --data-binary "@fieldMappings/entities.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/entities/_bulk" -ku admin:admin --data-binary "@mock/entities.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/entity-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entity-with-name.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/entities-with-examples' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entities-with-examples.json"

#Regexes
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/regexes" -ku admin:admin --data-binary "@fieldMappings/regexes.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/regexes/_bulk" -ku admin:admin --data-binary "@mock/regexes.json"
curl -L -X POST '[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/_scripts/regex-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/regex-with-name.json"

#Examples entities
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/examples-entities" -ku admin:admin --data-binary "@fieldMappings/examples-entities.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "[#TRAINING_OPENSEARCH]:[#TRAINING_OPENSEARCH_PORT]/examples-entities/_bulk" -ku admin:admin --data-binary "@mock/examples-entities.json"
