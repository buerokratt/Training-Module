/*
declaration:
  version: 0.1
  description: "Fetch the latest LLM training record by ID across all unique version numbers"
  method: get
  namespace: training
  returns: json
  allowlist:
    query: []
  response:
    fields:
      - field: id
        type: integer
        description: "Primary key of the training record"
      - field: version_number
        type: string
        description: "Version identifier in format major_minor"
      - field: state
        type: string
        enum: ['ACTIVATING', 'ALREADY_TRAINED', 'CROSS_VALIDATING', 'DELETED', 'DEPLOYED', 'ERROR', 'PROCESSING', 'READY', 'TESTING']
        description: "State of the model training process"
*/
WITH
    llm_data AS (
        SELECT
            id,
            version_number,
            state,
            created,
            ROW_NUMBER() OVER (
                PARTITION BY version_number
                ORDER BY created DESC
            ) AS rn
        FROM llm_trainings
    )

SELECT
    id,
    version_number,
    state
FROM llm_data
WHERE rn = 1
ORDER BY created DESC
LIMIT 1;
