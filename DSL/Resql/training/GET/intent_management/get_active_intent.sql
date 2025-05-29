/*
declaration:
  version: 0.1
  description: "Fetch the latest ACTIVE intent by name"
  method: get
  namespace: intent_management
  returns: json
  allowlist:
    query:
      - field: intent
        type: string
        description: "Intent name to filter for"
  response:
    fields:
      - field: id
        type: integer
        description: "Primary key of the intent entry"
      - field: intent
        type: string
        description: "Name of the intent"
      - field: status
        type: string
        enum: ['ACTIVE', 'DELETED']
        description: "Status of the intent (expected to be ACTIVE)"
      - field: created
        type: timestamp
        description: "Timestamp when the intent was created"
*/
SELECT id, intent, status, created
FROM intent
WHERE intent = :intent AND status = 'ACTIVE'
ORDER BY created DESC
LIMIT 1;
