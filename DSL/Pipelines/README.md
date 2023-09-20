
# Pipelines 

## Startup

#### Docker 
```
docker-compose up -d
```
Default service port is 3010 or the value of environment variable **PORT**.

#### Standalone

```
npm start
```


## API calls
### 1. Rasa YAML to OpenSearch
	Pipeline for populating OpenSearch with Rasa YAML files

####	POST /put/<index_name>/<index_type>
**body:** form with field `input` OR 
				attached file object on data field `input`

		Puts one entity into OpenSearch index `index_name` with ID identifier in object on field `index_type`
		Example: 
			POST /put/intents/intent
			
***example file***
```
nlu:
- intent: rahvaarv
  examples: |
    - palju rahvast eestis elab
    - kui palju elanikke meil on
    - mitu inimest harjumaal on
    - inimeste arv
    - rahvaarv
    - eesti rahvastik
```

####	POST /bulk/<index_name>/<index_type>
**body**: form with field `input` OR
			attached file object on data field `input`		

		Puts a list of entities with ID identifier in field `index_type` into OpenSearch index `index_name`  
		Example:
			POST /bulk/stories/story
			
***example file***
```
stories:
- story: andmekaitse_küsimused
  steps:
  - intent: andmekaitse_küsimused
  - action: utter_andmekaitse_küsimused
  
- story: Deactivate custom fallback form
  steps:
  - action: custom_fallback_form
  - slot_was_set:
    - asukoht: Tallinn
  - action: action_react_to_affirm_deny_in_custom_fallback_form
```

####	POST /bulk/<index_name>
**body**: form with field `input` OR
			attached file object on data field `input`		

		Puts a list of different entities into OpenSearch index `index_name`
		Example:
			POST /bulk/domain

***example file***
```
intents:
  - rahvaarv
  - common_tervitus
  - kompliment
  - common_hüvasti_jätmine
  - service_car_rent

entities:
  - asukoht

forms:
  custom_fallback_form:
    required_slots:
        - affirm_deny
  direct_to_customer_support_form:
    required_slots:
        - affirm_deny
```
####	POST /delete/<index_name>

		Deletes index `index_name`. 

		Example:
			POST /delete/intents

####	POST /delete/<index_name>/obj_id

		Deletes object with id `obj_id` from index `index_name`. 

		Example:
			POST /delete/intents/rahvaarv



### Script to populate OpenSearch with mock YAMLs
***./init_with_mocks.sh***
expects mock YAMLs to be in a configurable folder (default: .*./../mock1*)
Server has to be running

## 2. YAML to JSON (and vice versa)

Usage:
## POST /yaml
**body:** form with field `input` OR 
				attached file object on data field `input`
				
	Converts input YAMl file to JSON

## POST /json
**body:** form with field `input` OR 
				attached file object on data field `input`
				
	Converts input JSON file to YAML
