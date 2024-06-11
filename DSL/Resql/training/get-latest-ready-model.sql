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
  training_data_checksum
FROM llm_trainings
WHERE trained_date = (SELECT MAX(trained_date) FROM llm_trainings)
AND NOT EXISTS (
    SELECT 1
    FROM llm_trainings AS lt
    WHERE llm_trainings.version_number = lt.version_number
    AND lt.state = 'DELETED'
)
AND state = 'READY'
LIMIT 1;
