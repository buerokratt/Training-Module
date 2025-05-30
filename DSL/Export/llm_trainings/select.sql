COPY (
    SELECT *
    FROM llm_trainings
    WHERE (version_number, created) NOT IN (
        SELECT version_number, max(created)
        FROM llm_trainings
        GROUP BY version_number
    ) AND created < %(export_boundary)s
) TO stdout WITH csv HEADER;
