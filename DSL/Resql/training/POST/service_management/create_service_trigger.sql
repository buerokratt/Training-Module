/*
declaration:
  version: 0.1
  description: "Insert a new service trigger with intent, service, status, author role, and service name, returning created timestamp as requested_at"
  method: post
  accepts: json
  returns: json
  namespace: service_management
  allowlist:
    body:
      - field: intent
        type: string
        description: "Intent name or identifier"
      - field: serviceId
        type: string
        description: "Service identifier"
      - field: status
        type: string
        enum: ['pending','deleted', 'declined', 'approved']
        description: "Trigger status"
      - field: authorRole
        type: string
        enum: ['trainer', 'service_manager', 'admin']
        description: "Role of the author"
      - field: serviceName
        type: string
        description: "Human-readable service name"
  response:
    fields:
      - field: intent
        type: string
        description: "Intent name or identifier"
      - field: service
        type: string
        description: "Service identifier"
      - field: status
        type: string
        enum: ['pending','deleted', 'declined', 'approved']
        description: "Current status of the trigger"
      - field: service_name
        type: string
        description: "Service name"
      - field: author_role
        type: string
        enum: ['trainer', 'service_manager', 'admin']
        description: "Author role"
      - field: requested_at
        type: timestamp
        description: "Timestamp when the trigger was created"
*/
INSERT INTO service_trigger (intent, service, status, author_role, service_name)
VALUES (
    :intent, :serviceId, :status::TRIGGER_STATUS, :authorRole::AUTHOR_ROLE, :serviceName
)
RETURNING intent, service, status, service_name, author_role, created AS requested_at;
