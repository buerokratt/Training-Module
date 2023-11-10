#clear
curl -XDELETE 'http://localhost:9200/*' -u admin:admin --insecure
#responses
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/responses" -ku admin:admin --data-binary "@fieldMappings/responses.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/responses/_bulk" -ku admin:admin --data-binary "@mock/responses.json"
curl -L -X POST 'http://localhost:9200/_scripts/response-with-name-and-text' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/response-with-name-and-text.json"

#intents
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/intents" -ku admin:admin --data-binary "@fieldMappings/intents.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/intents/_bulk" -ku admin:admin --data-binary "@mock/intents.json"
curl -L -X POST 'http://localhost:9200/_scripts/intent-with-name' -H 'Content-Type: application/json' --data-binary "@templates/intent-with-name.json"
curl -L -X POST 'http://localhost:9200/_scripts/intents-with-examples-count' -H 'Content-Type: application/json' --data-binary "@templates/intents-with-examples-count.json"

#rules
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/rules" -ku admin:admin --data-binary "@fieldMappings/rules.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/rules/_bulk" -ku admin:admin --data-binary "@mock/rules.json"
curl -L -X POST 'http://localhost:9200/_scripts/rule-with-name' -H 'Content-Type: application/json' --data-binary "@templates/rule-with-name.json"
curl -L -X POST 'http://localhost:9200/_scripts/rule-with-forms' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-forms.json"
curl -L -X POST 'http://localhost:9200/_scripts/rule-with-responses' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-responses.json"
curl -L -X POST 'http://localhost:9200/_scripts/rule-with-slots' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-slots.json"

#stories
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/stories" -ku admin:admin --data-binary "@fieldMappings/stories.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/stories/_bulk" -ku admin:admin --data-binary "@mock/stories.json"
curl -L -X POST 'http://localhost:9200/_scripts/story-with-name' -H 'Content-Type: application/json' --data-binary "@templates/story-with-name.json"
curl -L -X POST 'http://localhost:9200/_scripts/story-with-forms' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-forms.json"
curl -L -X POST 'http://localhost:9200/_scripts/story-with-responses' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-responses.json"
curl -L -X POST 'http://localhost:9200/_scripts/story-with-slots' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-slots.json"

#Test stories
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/test-stories" -ku admin:admin --data-binary "@fieldMappings/test-stories.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/test-stories/_bulk" -ku admin:admin --data-binary "@mock/test-stories.json"
curl -L -X POST 'http://localhost:9200/_scripts/test-story-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/test-story-with-name.json"

#Forms
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/forms" -ku admin:admin --data-binary "@fieldMappings/forms.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/forms/_bulk" -ku admin:admin --data-binary "@mock/forms.json"
curl -L -X POST 'http://localhost:9200/_scripts/form-with-slot' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/form-with-slot.json"

#Entities
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/entities" -ku admin:admin --data-binary "@fieldMappings/entities.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/entities/_bulk" -ku admin:admin --data-binary "@mock/entities.json"
curl -L -X POST 'http://localhost:9200/_scripts/entity-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entity-with-name.json"
curl -L -X POST 'http://localhost:9200/_scripts/entities-with-examples' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entities-with-examples.json"

#Regexes
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/regexes" -ku admin:admin --data-binary "@fieldMappings/regexes.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/regexes/_bulk" -ku admin:admin --data-binary "@mock/regexes.json"
curl -L -X POST 'http://localhost:9200/_scripts/regex-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/regex-with-name.json"

#Examples entities
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/examples-entities" -ku admin:admin --data-binary "@fieldMappings/examples-entities.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/examples-entities/_bulk" -ku admin:admin --data-binary "@mock/examples-entities.json"

#Slots
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/slots" -ku admin:admin --data-binary "@fieldMappings/slots.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/slots/_bulk" -ku admin:admin --data-binary "@mock/slots.json"
