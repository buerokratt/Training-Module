SELECT id, state, trained_date, model_type, model_version,
       cross_validation_report, file_name, version_number, test_report, created
FROM llm_trainings
WHERE state = 'PROCESSING'
ORDER BY trained_date DESC
LIMIT 1;