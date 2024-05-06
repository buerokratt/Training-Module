SELECT id, model_type, state, trained_date, file_name, version_number, image_version, test_report, created
FROM llm_trainings
WHERE id = (
  SELECT max(id)
  FROM llm_trainings
  WHERE status = 'DEPLOYED'
);
