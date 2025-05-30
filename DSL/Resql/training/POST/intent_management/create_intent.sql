/*
declaration:
  version: 0.1
  description: "Insert a new intent record with the current timestamp and specified status"
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
        enum: ['ACTIVE', 'DELETED']
        description: "Status of the intent"
*/
INSERT INTO intent (intent, created, status, isforservice)
VALUES (:intent, CURRENT_TIMESTAMP, UPPER(:status)::INTENT_STATUS_TYPE, :isForService);
