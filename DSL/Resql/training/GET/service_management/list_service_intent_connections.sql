/*
declaration:
  version: 0.1
  description: "Fetch the latest approved service triggers grouped by intent and service"
  method: get
  namespace: service_management
  returns: json
  allowlist:
    query: []
  response:
    fields:
      - field: intent
        type: string
        description: "Intent associated with the service trigger"
      - field: service
        type: string
        description: "Service identifier"
      - field: service_name
        type: string
        description: "Name of the service (latest approved)"
*/
WITH LatestStatus AS (
    SELECT intent,
           service,
           status,
           service_name,
           ROW_NUMBER() OVER (PARTITION BY intent, service ORDER BY created DESC) AS rn
    FROM service_trigger
)
SELECT intent,
       service,
       MAX(service_name) AS service_name
FROM LatestStatus
WHERE rn = 1 AND status = 'approved'
GROUP BY intent, service;
