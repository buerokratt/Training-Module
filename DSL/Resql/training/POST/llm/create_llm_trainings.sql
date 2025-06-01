/*
declaration:
  version: 0.1
  description: "Insert a new record into LLM trainings with model details and reports"
  method: post
  accepts: json
  returns: json
  namespace: security
  allowlist:
    body:
      - field: model_type
        type: string
        description: "Type or name of the machine learning model"
      - field: state
        type: string
        enum: ['ACTIVATING', 'ALREADY_TRAINED', 'CROSS_VALIDATING', 'DELETED', 'DEPLOYED', 'ERROR', 'PROCESSING', 'READY', 'TESTING']
        description: "Current state or status of the training"
      - field: trained_date
        type: string
        description: "Training completion date in ISO format"
      - field: file_name
        type: string
        description: "Name of the training data file"
      - field: version_number
        type: string
        description: "Version number of the training"
      - field: model_version
        type: string
        description: "Model version identifier"
      - field: test_report
        type: string
        description: "Report or summary of the model test"
      - field: cross_validation_report
        type: string
        description: "Report on cross-validation results"
      - field: training_data_checksum
        type: string
        description: "Checksum to verify training data integrity"
  response:
    fields: []
*/
INSERT INTO llm.llm_trainings (
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
)
VALUES (
    :model_type,
    UPPER(:state)::LLM_TRAINING_STATE_TYPE,
    TO_TIMESTAMP(:trained_date, 'YYYY-MM-DD"T"HH24:MI:SS'),
    :file_name,
    :version_number,
    :model_version,
    :test_report,
    :cross_validation_report,
    CURRENT_TIMESTAMP,
    :training_data_checksum
);
