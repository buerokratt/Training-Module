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
FROM llm_trainings
WHERE state = 'READY'
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
FROM deployed_model;