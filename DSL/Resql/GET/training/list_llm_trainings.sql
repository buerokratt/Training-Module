/*
declaration:
  version: 0.1
  description: "Fetch LLM training models that are either deployed or the latest ready/activating models, excluding deleted states"
  method: get
  namespace: training
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
        description: "Current model state"
      - field: trained_date
        type: timestamp
        description: "Date and time the model was trained"
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
WITH max_ids AS (
    SELECT
        MAX(id) AS id,
        version_number
    FROM llm_trainings
    GROUP BY version_number
), deployed_model AS (
    SELECT 
        id,
        model_type,
        state,
        trained_date,
        file_name,
        version_number,
        model_version, 
        test_report,
        cross_validation_report,
        created
    FROM llm_trainings
    WHERE state = 'DEPLOYED'
    AND NOT EXISTS (
        SELECT 1
        FROM llm_trainings AS lt
        WHERE llm_trainings.version_number = lt.version_number
        AND lt.state = 'DELETED' 
    )
    ORDER BY created DESC
    LIMIT 1
), latest_ready_activating_models AS (
  SELECT 
    lt.id, lt.model_type,
    CASE 
        WHEN lt.state = 'ACTIVATING' THEN 'ACTIVATING'
        WHEN lt.state = 'DELETED' THEN 'DELETED'
        WHEN lt.file_name = '' THEN 'DELETED'
        ELSE 'READY'
    END AS state,
    lt.trained_date, 
    lt.file_name, 
    lt.version_number, 
    lt.model_version, 
    lt.test_report, 
    lt.created, 
    lt.cross_validation_report, 
    lt.training_data_checksum
    FROM llm_trainings lt
    WHERE lt.id IN (SELECT id FROM max_ids)
    AND lt.id NOT IN (
        SELECT id
        FROM deployed_model
    )
    AND NOT EXISTS (
        SELECT 1
        FROM llm_trainings AS lt2
        WHERE lt.version_number = lt2.version_number
        AND lt2.state = 'DELETED' 
    )
)
SELECT 
    model_type,
    state,
    trained_date,
    file_name,
    version_number,
    model_version, 
    test_report,
    cross_validation_report,
    created
FROM (
    SELECT 
        model_type,
        state,
        trained_date,
        file_name,
        version_number,
        model_version, 
        test_report,
        cross_validation_report,
        created
    FROM latest_ready_activating_models
    UNION ALL
    SELECT 
        model_type,
        state,
        trained_date,
        file_name,
        version_number,
        model_version, 
        test_report,
        cross_validation_report,
        created
    FROM deployed_model
) AS combined_results
WHERE state <> 'DELETED'
ORDER BY 
    CAST(SPLIT_PART(version_number, '_', 1) AS INTEGER), 
    CAST(SPLIT_PART(version_number, '_', 2) AS INTEGER);