/*
declaration:
  version: 0.1
  description: "Fetch the latest non-deleted configuration entry by key"
  method: get
  namespace: config
  returns: json
  allowlist:
    query:
      - field: key
        type: string
        description: "Configuration key to filter by"
  response:
    fields:
      - field: id
        type: integer
        description: "Primary key of the configuration entry"
      - field: key
        type: string
        description: "Configuration key"
      - field: value
        type: string
        description: "Configuration value"
      - field: deleted
        type: boolean
        description: "Flag indicating whether the entry is deleted"
      - field: created
        type: timestamp
        description: "Timestamp when the configuration entry was created"
*/
SELECT
    id,
    key,
    value,
    deleted,
    created
FROM config.configuration AS c_1
WHERE
    key = :key
    AND created = (
        SELECT MAX(c_2.created) FROM config.configuration AS c_2
        WHERE c_2.key = c_1.key
    )
    AND NOT deleted;
