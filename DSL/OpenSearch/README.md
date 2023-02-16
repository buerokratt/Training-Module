# Bürokratt's Training Module DSL Opensearch commands
## Responses
##### Create response index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/response" -ku admin:admin --data-binary "@fieldMappings/responses.json"
```
##### Add mock data from response.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/response/_bulk" -ku admin:admin --data-binary "@mock/responses.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/response/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"name":"utter_andmekaitse_küsimused"}}}'
```
##### Templates for searching responses
```
curl -L -X POST 'http://localhost:9200/_scripts/response-with-name-and-text' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/response-with-name-and-text.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/response/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "response-with-name-and-text", "params": {"response_name": "fallback", "response_text": "kas"}}'
```
## Intents
##### Create intents index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/intents" -ku admin:admin --data-binary "@fieldMappings/intents.json"
```
##### Add mock data from intents.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/intents/_bulk" -ku admin:admin --data-binary "@mock/intents.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/intents/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"intent":"common_tervitus"}}}'
```
##### Templates for searching intents
```
curl -L -X POST 'http://localhost:9200/_scripts/intent-with-name' -H 'Content-Type: application/json' --data-binary "@templates/intent-with-name.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/intents/_search/template' -H 'Content-Type: application/json' --data-raw '{"id": "intent-with-name", "params": {"intent": "andmekaitse"}}'
```
##### Templates for getting intents with example count
```
curl -L -X POST 'http://localhost:9200/_scripts/intents-with-examples-count' -H 'Content-Type: application/json' --data-binary "@templates/intents-with-examples-count.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/intents/_search/template' -H 'Content-Type: application/json' --data-raw '{"id": "intents-with-examples-count", "params": {"intent": "andmekaitse"}}'
```
## Rules
##### Create rules index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/rules" -ku admin:admin --data-binary "@fieldMappings/rules.json"
```
##### Add mock data from rules.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/rules/_bulk" -ku admin:admin --data-binary "@mock/rules.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/rules/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"rule":"common_tervitus"}}}'
```
## Stories
##### Create stories index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/stories" -ku admin:admin --data-binary "@fieldMappings/stories.json"
```
##### Add mock data from stories.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/stories/_bulk" -ku admin:admin --data-binary "@mock/stories.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/stories/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"story":"tervitamine"}}}'
```
## Test stories
##### Create test stories index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/test-stories" -ku admin:admin --data-binary "@fieldMappings/test-stories.json"
```
##### Add mock data from test-stories.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/test-stories/_bulk" -ku admin:admin --data-binary "@mock/test-stories.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/test-stories/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"story":"common_tervitus"}}}'
```
##### Templates for searching test stories
```
curl -L -X POST 'http://localhost:9200/_scripts/test-story-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/test-story-name.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/test-stories/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "test-story-name", "params": {"test-story-name": "common_tervitus"}}'
```
## Forms
##### Create forms index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/forms" -ku admin:admin --data-binary "@fieldMappings/forms.json"
```
##### Add mock data from forms.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/forms/_bulk" -ku admin:admin --data-binary "@mock/forms.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/forms/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"form":"custom_fallback_form"}}}'
```
## Entities
##### Create entities index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/entities" -ku admin:admin --data-binary "@fieldMappings/entities.json"
```
##### Add mock data from entities.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/entities/_bulk" -ku admin:admin --data-binary "@mock/entities.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/entities/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"entities":"asukoht"}}}'
```