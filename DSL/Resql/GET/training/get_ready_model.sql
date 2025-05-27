/*
declaration:
  version: 0.1
  description: "Fetch the READY model training entry by specific version number"
  method: get
  namespace: training
  returns: json
  allowlist:
    query:
      - field: versionNumber
        type: string
        description: "Version identifier to filter the READY model"
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
WHERE state = 'READY' AND version_number = :versionNumber
LIMIT 1;
