# Bürokratt's Training Module DSL Opensearch commands
## Responses
##### Create response index
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/response" -ku admin:admin --data-binary "@responses/response-field_mappings.json"
```
##### Add mock data from response.json file
```
curl -H "Content-Type: application/x-ndjson" -X PUT "http://localhost:9200/response/_bulk" -ku admin:admin --data-binary "@responses/response.json"
```
##### Test query to index to validate that mock data is there
```
curl -H 'Content-Type: application/json' -X GET "http://localhost:9200/response/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"name":"utter_andmekaitse_küsimused"}}}'
```
##### Templates for searching responses
```
curl -L -X POST 'http://localhost:9200/_scripts/response-with-name-and-text' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-binary "@responses/response-with-name-and-text.json"
```
##### Test template
```
curl -L -X GET 'http://localhost:9200/response/_search/template' -H 'Content-Type: application/json' -H 'Cookie: customJwtCookie=test' --data-raw '{"id": "response-with-name-and-text", "params": {"response_name": "fallback", "response_text": "kas"}}'
```