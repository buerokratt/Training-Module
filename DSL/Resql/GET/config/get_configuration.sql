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
SELECT id, key, value, deleted, created
FROM configuration
WHERE key=:key
AND id IN (SELECT max(id) from configuration GROUP BY key)
AND NOT deleted;
