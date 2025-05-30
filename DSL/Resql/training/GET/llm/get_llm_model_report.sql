/*
declaration:
  version: 0.1
  description: "Fetch the most recent LLM training entry by file name"
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
      - field: file_name
        type: string
        description: "Filename of the trained model"
      - field: test_report
        type: string
        description: "Serialized test report JSON"
      - field: cross_validation_report
        type: string
        description: "Serialized cross-validation report JSON"
      - field: created
        type: timestamp
        description: "Timestamp of model creation"
      - field: state
        type: string
        enum: ['ACTIVATING', 'ALREADY_TRAINED', 'CROSS_VALIDATING', 'DELETED', 'DEPLOYED', 'ERROR', 'PROCESSING', 'READY', 'TESTING']
        description: "State of the model training process"
      - field: trained_date
        type: timestamp
        description: "Timestamp when the model was trained"
*/
SELECT
    file_name,
    test_report,
    cross_validation_report,
    created,
    state,
    trained_date
FROM llm_trainings
WHERE
    file_name = :fileName
    AND created = (
        SELECT MAX(created)
        FROM llm_trainings
        WHERE file_name = :fileName
    );
