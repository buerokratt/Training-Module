#responses
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/response" -ku admin:admin --data-binary "@fieldMappings/responses.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/response/_bulk" -ku admin:admin --data-binary "@mock/responses.json"
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

#stories
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/stories" -ku admin:admin --data-binary "@fieldMappings/stories.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/stories/_bulk" -ku admin:admin --data-binary "@mock/stories.json"

#Test stories
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/test-stories" -ku admin:admin --data-binary "@fieldMappings/test-stories.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/test-stories/_bulk" -ku admin:admin --data-binary "@mock/test-stories.json"
curl -L -X POST 'http://localhost:9200/_scripts/test-story-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/test-story-with-name.json"

#Forms
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/forms" -ku admin:admin --data-binary "@fieldMappings/forms.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/forms/_bulk" -ku admin:admin --data-binary "@mock/forms.json"

#Entities
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/entities" -ku admin:admin --data-binary "@fieldMappings/entities.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/entities/_bulk" -ku admin:admin --data-binary "@mock/entities.json"
curl -L -X POST 'http://localhost:9200/_scripts/entity-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entity-with-name.json"

#Regexes
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/regexes" -ku admin:admin --data-binary "@fieldMappings/regexes.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/regexes/_bulk" -ku admin:admin --data-binary "@mock/regexes.json"

#Examples entities
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/examples-entities" -ku admin:admin --data-binary "@fieldMappings/examples-entities.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/examples-entities/_bulk" -ku admin:admin --data-binary "@mock/examples-entities.json"

#Rules search
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/rules-search" -ku admin:admin --data-binary "@fieldMappings/rules-search.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/rules-search/_bulk" -ku admin:admin --data-binary "@mock/rules-search.json"
curl -L -X POST 'http://localhost:9200/_scripts/rules-with-suffix-form' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rules-with-suffix-form.json"
curl -L -X POST 'http://localhost:9200/_scripts/rules-with-prefix-utter' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rules-with-prefix-utter.json"

#Stories search
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/stories-search" -ku admin:admin --data-binary "@fieldMappings/stories-search.json"
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/stories-search/_bulk" -ku admin:admin --data-binary "@mock/stories-search.json"
curl -L -X POST 'http://localhost:9200/_scripts/stories-with-suffix-form' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/stories-with-suffix-form.json"
curl -L -X POST 'http://localhost:9200/_scripts/stories-with-prefix-utter' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/stories-with-prefix-utter.json"
