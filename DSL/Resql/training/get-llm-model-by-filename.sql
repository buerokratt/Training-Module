SELECT id, model_type, state, trained_date, file_name, version_number, model_version, test_report, cross_validation_report, created, training_data_checksum
FROM llm_trainings lt
WHERE file_name = :fileName
AND created = (
  SELECT MAX(created)
  FROM llm_trainings
  WHERE file_name LIKE :fileName
);
