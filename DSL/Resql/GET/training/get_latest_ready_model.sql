/*
declaration:
  version: 0.1
  description: "Fetch the most recently trained model in READY state, excluding deleted versions"
  method: get
  namespace: llm_trainings
  returns: json
  allowlist:
    query: []
  response:
    fields:
      - field: model_type
        type: string
        description: "Type of the trained model"
      - field: state
        type: string
        description: "Model state, expected to be 'READY'"
      - field: trained_date
        type: timestamp
        description: "Timestamp when the model was trained"
      - field: file_name
        type: string
        description: "Filename of the trained model"
      - field: version_number
        type: string
        description: "Version identifier in format major_minor"
      - field: model_version
        type: string
        description: "Internal model version string"
      - field: test_report
        type: string
        description: "Serialized test report JSON"
      - field: cross_validation_report
        type: string
        description: "Serialized cross-validation report JSON"
      - field: created
        type: timestamp
        description: "Timestamp of model creation"
      - field: training_data_checksum
        type: string
        description: "Checksum of the training dataset"
*/
SELECT
  model_type,
  state,
  trained_date,
  file_name,
  version_number,
  model_version, 
  test_report,
  cross_validation_report,
  created,
  training_data_checksum
FROM llm_trainings
WHERE trained_date = (SELECT MAX(trained_date) FROM llm_trainings)
AND NOT EXISTS (
    SELECT 1
    FROM llm_trainings AS lt
    WHERE llm_trainings.version_number = lt.version_number
    AND lt.state = 'DELETED'
)
AND state = 'READY'
LIMIT 1;
