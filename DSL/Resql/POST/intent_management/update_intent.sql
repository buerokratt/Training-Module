/*
declaration:
  version: 0.1
  description: "Insert a new intent record with the current timestamp, status, and isForService flag"
  method: post
  accepts: json
  returns: json
  namespace: intent_management
  allowlist:
    body:
      - field: intent
        type: string
        description: "Name or identifier of the intent"
      - field: status
        type: string
        description: "Status of the intent"
      - field: isForService
        type: boolean
        description: "Flag indicating if the intent is for service"
*/
INSERT INTO intent (intent, created, status, isForService)
VALUES (:intent, CURRENT_TIMESTAMP, :status, :isForService);