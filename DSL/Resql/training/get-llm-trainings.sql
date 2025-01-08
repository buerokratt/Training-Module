WITH deployed_model AS (
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
),
latest_ready_activating_models AS (
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
        ROW_NUMBER() OVER (PARTITION BY version_number ORDER BY created DESC) AS rn
    FROM llm_trainings
    WHERE (state = 'READY' OR state = 'ACTIVATING')
    AND NOT EXISTS (
        SELECT 1
        FROM llm_trainings AS lt
        WHERE llm_trainings.version_number = lt.version_number
        AND lt.state = 'DELETED' 
    )
    AND version_number NOT IN (
        SELECT version_number
        FROM deployed_model
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
    WHERE rn = 1
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
ORDER BY 
    CAST(SPLIT_PART(version_number, '_', 1) AS INTEGER), 
    CAST(SPLIT_PART(version_number, '_', 2) AS INTEGER);
