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
WHERE state = 'READY' AND version_number = :versionNumber
LIMIT 1;
