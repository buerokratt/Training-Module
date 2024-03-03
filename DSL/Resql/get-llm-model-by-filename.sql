SELECT *
FROM llm_trainings lt
WHERE file_name = :fileName
  AND created = (
    SELECT MAX(created)
    FROM llm_trainings
    WHERE file_name LIKE :fileName
);