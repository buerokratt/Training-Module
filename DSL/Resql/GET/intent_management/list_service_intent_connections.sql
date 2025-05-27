/*
declaration:
  version: 0.1
  description: "Fetch the latest ACTIVE entries for a list of intents"
  method: get
  namespace: intent_management
  returns: json
  allowlist:
    query:
      - field: intentsList
        type: string
        description: "Comma-separated list of intent names to filter by (in array format)"
  response:
    fields:
      - field: id
        type: integer
        description: "Primary key of the intent entry"
      - field: intent
        type: string
        description: "Name of the intent"
      - field: created
        type: timestamp
        description: "Timestamp when the intent was created"
      - field: isForService
        type: boolean
        description: "Flag indicating whether the intent is for a service"
*/
SELECT id, intent, created, isForService
FROM intent
WHERE (intent, created) IN (
    SELECT intent, MAX(created)
    FROM intent
    WHERE intent IN (:intentsList) AND status = 'ACTIVE'
    GROUP BY intent
)
ORDER BY created DESC;