/*
declaration:
  version: 0.1
  description: "Insert a new LLM training record with model metadata, state, and evaluation reports"
  method: post
  namespace: auth_users
  returns: json
  allowlist:
    query:
      - field: model_type
        type: string
        description: "Type or name of the trained model"
      - field: state
        type: string
        enum: ['ACTIVATING', 'ALREADY_TRAINED', 'CROSS_VALIDATING', 'DELETED', 'DEPLOYED', 'ERROR', 'PROCESSING', 'READY', 'TESTING']
        description: "Training state (e.g. queued, success, failed)"
      - field: trained_date
        type: string
        description: "Training completion timestamp in ISO 8601 format (e.g., 2025-05-27T15:00:00)"
      - field: file_name
        type: string
        description: "Name of the file containing the training data"
      - field: version_number
        type: string
        description: "Internal or semantic version number for the model iteration"
      - field: model_version
        type: string
        description: "Model architecture or framework version"
      - field: test_report
        type: string
        description: "Text or JSON report summarizing test results"
      - field: cross_validation_report
        type: string
        description: "Text or JSON report from cross-validation"
      - field: training_data_checksum
        type: string
        description: "Checksum (e.g., SHA256) to verify integrity of the training data used"
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
