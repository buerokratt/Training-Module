/*
declaration:
  version: 0.1
  description: "Fetch the most recent LLM training entry with full metadata by file name"
  method: get
  namespace: training
  returns: json
  allowlist:
    query:
      - field: fileName
        type: string
        description: "Exact or partial name of the model file to filter by"
  response:
    fields:
      - field: id
        type: integer
        description: "Primary key of the training entry"
      - field: model_type
        type: string
        description: "Type of the trained model"
      - field: state
        type: string
        description: "State of the model training process"
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
SELECT id, model_type, state, trained_date, file_name, version_number, model_version, test_report, cross_validation_report, created, training_data_checksum
FROM llm_trainings lt
WHERE file_name = :fileName
AND created = (
  SELECT MAX(created)
  FROM llm_trainings
  WHERE file_name = :fileName
);
