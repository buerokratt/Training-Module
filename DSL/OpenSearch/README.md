# Bürokratt's Training Module DSL Opensearch commands
##### To reset indexes
```
curl -XDELETE 'http://localhost:9200/*' -u admin:admin --insecure
```
##### To load all indexes with mock data
```
sh init.sh
```
## Responses
##### Create response index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/responses" -ku admin:admin --data-binary "@fieldMappings/responses.json"
```
##### Add mock data from response.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/responses/_bulk" -ku admin:admin --data-binary "@mock/responses.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/responses/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"name":"utter_andmekaitse_küsimused"}}}'
```
##### Templates for searching responses
```
curl -L -X POST 'http://localhost:9200/_scripts/response-with-name-and-text' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/response-with-name-and-text.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/responses/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "response-with-name-and-text", "params": {"response_name": "fallback", "response_text": "kas"}}'
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
##### Templates for searching rules
```
curl -L -X POST 'http://localhost:9200/_scripts/rule-with-name' -H 'Content-Type: application/json' --data-binary "@templates/rule-with-name.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/rules/_search/template' -H 'Content-Type: application/json' --data-raw '{"id": "rule-with-name", "params": {"rule": "rahvaarv_olemas"}}'
```
##### Templates for searching forms in rules
```
curl -L -X POST 'http://localhost:9200/_scripts/rule-with-forms' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-forms.json"
```
##### Templates for searching responses in rules
```
curl -L -X POST 'http://localhost:9200/_scripts/rule-with-responses' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-responses.json"
```
##### Templates for searching slots in rules
```
curl -L -X POST 'http://localhost:9200/_scripts/rule-with-slots' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/rule-with-slots.json"
```
##### Test form template
```
curl -L -X GET 'http://localhost:9200/rules/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "rule-with-forms", "params": {"form": "custom_fallback_form"}}'
```
##### Test response template
```
curl -L -X GET 'http://localhost:9200/rules/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "rule-with-responses", "params": {"response": "utter_common_tervitus"}}'
```
##### Test slot template
```
curl -L -X GET 'http://localhost:9200/rules/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "rule-with-slots", "params": {"slot": "common_teenus_ilm_asukoht"}}'
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
##### Templates for searching stories
```
curl -L -X POST 'http://localhost:9200/_scripts/story-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-name.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/stories/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "story-with-name", "params": {"story": "tervitamine"}}'
```
##### Templates for searching forms in stories
```
curl -L -X POST 'http://localhost:9200/_scripts/story-with-forms' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-forms.json"
```
##### Templates for searching responses in stories
```
curl -L -X POST 'http://localhost:9200/_scripts/story-with-responses' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-responses.json"
```
##### Templates for searching slots in stories
```
curl -L -X POST 'http://localhost:9200/_scripts/story-with-slots' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/story-with-slots.json"
```
##### Test forms template
```
curl -L -X GET 'http://localhost:9200/stories/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "story-with-forms", "params": {"form": "custom_fallback_form"}}'
```
##### Test responses template
```
curl -L -X GET 'http://localhost:9200/stories/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "story-with-responses", "params": {"response": "utter_andmekaitse_küsimused"}}'
```
##### Test slots template
```
curl -L -X GET 'http://localhost:9200/stories/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "rule-with-slots", "params": {"slot": "asukoht"}}'
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
curl -L -X POST 'http://localhost:9200/_scripts/test-story-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/test-story-with-name.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/test-stories/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "test-story-with-name", "params": {"story": "common_tervitus"}}'
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
##### Templates for searching slots in forms
```
curl -L -X POST 'http://localhost:9200/_scripts/form-with-slot' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/form-with-slot.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/forms/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "form-with-slot", "params": {"slot": "affirm_deny"}}'
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
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/entities/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"entity":"asukoht"}}}'
```
##### Templates for searching entities
```
curl -L -X POST 'http://localhost:9200/_scripts/entity-with-name' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@templates/entity-with-name.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/entities/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "entity-with-name", "params": {"entity": "common_tervitus"}}'
```
## Regexes
##### Create regexes index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/regexes" -ku admin:admin --data-binary "@fieldMappings/regexes.json"
```
##### Add mock data from regexes.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/regexes/_bulk" -ku admin:admin --data-binary "@mock/regexes.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/regexes/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"regex":"asukoht"}}}'
```
## Examples entities
##### Create examples entities index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/examples-entities" -ku admin:admin --data-binary "@fieldMappings/examples-entities.json"
```
##### Add mock data from examples-entities.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/examples-entities/_bulk" -ku admin:admin --data-binary "@mock/examples-entities.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/examples-entities/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"file":"rahvaarv_nlu.yml"}}}'
```
