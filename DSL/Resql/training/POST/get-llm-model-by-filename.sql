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
        created,
        training_data_checksum,
        description
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
    lt.training_data_checksum,
    lt.description
    FROM llm_trainings lt
    JOIN max_ids mi ON lt.id = mi.id
    where mi.id NOT IN (
        SELECT id
        FROM deployed_model
    )
    AND NOT EXISTS (
        SELECT 1
        FROM llm_trainings AS lt
        WHERE mi.version_number = lt.version_number
        AND lt.state = 'DELETED' 
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
    created,
    training_data_checksum,
    description
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
        created,
        training_data_checksum,
        description
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
        created,
        training_data_checksum,
        description
    FROM deployed_model
) AS combined_results
WHERE state <> 'DELETED'
AND file_name LIKE :fileName
ORDER BY 
    CAST(SPLIT_PART(version_number, '_', 1) AS INTEGER), 
    CAST(SPLIT_PART(version_number, '_', 2) AS INTEGER);
