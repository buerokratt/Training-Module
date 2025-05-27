/*
declaration:
  version: 0.1
  description: "Fetch the most recent LLM training record in PROCESSING state"
  method: get
  namespace: llm_trainings
  returns: json
  allowlist:
    query: []
  response:
    fields:
      - field: id
        type: integer
        description: "Primary key of the training record"
      - field: state
        type: string
        description: "Current state of the training process"
      - field: trained_date
        type: timestamp
        description: "Timestamp when the model training occurred"
      - field: model_type
        type: string
        description: "Type of the trained model"
      - field: model_version
        type: string
        description: "Internal model version string"
      - field: cross_validation_report
        type: string
        description: "Serialized cross-validation report JSON"
      - field: file_name
        type: string
        description: "Filename of the trained model"
      - field: version_number
        type: string
        description: "Version identifier in format major_minor"
      - field: test_report
        type: string
        description: "Serialized test report JSON"
      - field: created
        type: timestamp
        description: "Timestamp of model creation"
*/
SELECT
  id,
  state,
  trained_date,
  model_type,
  model_version,
  cross_validation_report,
  file_name,
  version_number,
  test_report,
  created
FROM llm_trainings
WHERE trained_date = (SELECT max(trained_date) FROM llm_trainings WHERE state = 'PROCESSING')
LIMIT 1;
