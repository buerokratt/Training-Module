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
        enum: ['ACTIVATING', 'ALREADY_TRAINED', 'CROSS_VALIDATING', 'DELETED', 'DEPLOYED', 'ERROR', 'PROCESSING', 'READY', 'TESTING']
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
WITH
    max_ids AS (
        SELECT
            id,
            version_number,
            ROW_NUMBER() OVER (
                PARTITION BY version_number
                ORDER BY created DESC
            ) AS rn
        FROM llm.llm_trainings
    ),

    deployed_model AS (
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
        FROM llm.llm_trainings AS lt_1
        WHERE
            state = 'DEPLOYED'
            AND NOT EXISTS (
                SELECT 1
                FROM llm.llm_trainings AS lt_2
                WHERE
                    lt_1.version_number = lt_2.version_number
                    AND lt_2.state = 'DELETED'
            )
        ORDER BY created DESC
        LIMIT 1
    ),

    latest_ready_activating_models AS (
        SELECT
            lt.id,
            lt.model_type,
            lt.trained_date,
            lt.file_name,
            lt.version_number,
            lt.model_version,
            lt.test_report,
            lt.created,
            lt.cross_validation_report,
            lt.training_data_checksum,
            CASE
                WHEN lt.state = 'ACTIVATING' THEN 'ACTIVATING'
                WHEN lt.state = 'DELETED' THEN 'DELETED'
                WHEN lt.file_name = '' THEN 'DELETED'
                ELSE 'READY'
            END AS state
        FROM llm.llm_trainings AS lt
        WHERE
            lt.id IN (
                SELECT id FROM max_ids
                WHERE rn = 1
            )
            AND lt.id NOT IN (
                SELECT id
                FROM deployed_model
            )
            AND NOT EXISTS (
                SELECT 1
                FROM llm.llm_trainings AS lt_2
                WHERE
                    lt.version_number = lt_2.version_number
                    AND lt_2.state = 'DELETED'
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
ORDER BY STRING_TO_ARRAY(version_number, '_')::INT [];
