SELECT
  id,
  state,
  trained_date,
  model_type,
  image_version,
  cross_validation_report,
  file_name,
  version_number,
  test_report,
  created
FROM llm_trainings
WHERE trained_date = (SELECT max(trained_date) FROM llm_trainings WHERE state = 'PROCESSING')
LIMIT 1;
