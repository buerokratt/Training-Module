SELECT id, model_type, state, trained_date, file_name, version_number, image_version, test_report, created
FROM llm_trainings
WHERE trained_date = (
  SELECT max(trained_date)
  FROM llm_trainings
  WHERE state = 'Trained' OR state = 'DEPLOYED'
)
LIMIT 1;
