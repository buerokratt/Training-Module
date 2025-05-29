WITH llm_data AS (
    SELECT
        id, version_number, state, created,
        ROW_NUMBER() OVER (PARTITION BY version_number ORDER BY created DESC) AS rn
    FROM llm_trainings
)
SELECT id, version_number, state
FROM llm_data
WHERE rn = 1
ORDER BY created DESC
LIMIT 1;