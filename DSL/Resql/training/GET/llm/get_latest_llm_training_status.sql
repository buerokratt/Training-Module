WITH llm_data AS (
    SELECT
        id, version_number, state,
        ROW_NUMBER() OVER (PARTITION BY version_number ORDER BY id DESC) AS rn
    FROM llm.llm_trainings
)
SELECT id, version_number, state
FROM llm_data
WHERE rn = 1
ORDER BY id desc
LIMIT 1;
