/*
declaration:
  version: 0.1
  description: "Fetch the most recently deployed LLM training model"
  method: get
  namespace: llm_trainings
  returns: json
  allowlist:
    query: []
  response:
    fields:
      - field: id
        type: integer
        description: "Primary key of the deployed training record"
      - field: model_type
        type: string
        description: "Type of the trained model"
      - field: state
        type: string
        description: "Current model state, expected to be 'DEPLOYED'"
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
*/
SELECT id, model_type, state, trained_date, file_name, version_number, model_version, test_report, cross_validation_report, created
FROM llm_trainings
WHERE id = (
  SELECT max(id)
  FROM llm_trainings
  WHERE status = 'DEPLOYED'
);
