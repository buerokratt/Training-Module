SELECT id, model_type, state, trained_date, file_name, version_number, image_version, test_report, created
FROM llm_trainings lt
WHERE file_name = :fileName
AND created = (
  SELECT MAX(created)
  FROM llm_trainings
  WHERE file_name LIKE :fileName
);
