SELECT t.file_name, t.version_number, t.state, t.model_version, t.trained_date, t.created
FROM llm_trainings t
         INNER JOIN (
    SELECT file_name, MAX(created) AS latest_created
    FROM llm_trainings
    GROUP BY file_name
) subquery ON t.file_name = subquery.file_name AND t.created = subquery.latest_created;