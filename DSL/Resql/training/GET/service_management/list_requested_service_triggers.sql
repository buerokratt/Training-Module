/*
declaration:
  version: 0.1
  description: "Fetch paginated and sorted list of pending service triggers excluding those authored by trainers"
  method: get
  namespace: service_management
  returns: json
  allowlist:
    query:
      - field: page
        type: integer
        description: "Page number starting from 1"
      - field: page_size
        type: integer
        description: "Number of results per page"
      - field: sorting
        type: string
        enum: ['intent asc', 'intent desc', 'serviceName asc', 'serviceName desc', 'requestedAt asc', 'requestedAt desc']
        description: "Sort order for the results"
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
        description: "Name of the service"
      - field: requested_at
        type: timestamp
        description: "Timestamp of the trigger request"
      - field: author_role
        type: string
        description: "Role of the user who authored the trigger"
      - field: total_pages
        type: integer
        description: "Total number of result pages based on page size"
*/
SELECT
    intent,
    service,
    service_name,
    created AS requested_at,
    author_role,
    CEIL(COUNT(*) OVER () / :page_size::DECIMAL) AS total_pages
FROM service_management.service_trigger AS st_1
WHERE
    status = 'pending'
    AND author_role != 'trainer'
    AND created = (
        SELECT MAX(created)
        FROM service_management.service_trigger AS st_2
        WHERE
            st_1.intent = st_2.intent
            AND st_1.service = st_2.service
    )
ORDER BY
    CASE WHEN :sorting = 'intent asc' THEN intent END ASC,
    CASE WHEN :sorting = 'intent desc' THEN intent END DESC,
    CASE WHEN :sorting = 'serviceName asc' THEN service_name END ASC,
    CASE WHEN :sorting = 'serviceName desc' THEN service_name END DESC,
    CASE WHEN :sorting = 'requestedAt asc' THEN created END ASC,
    CASE WHEN :sorting = 'requestedAt desc' THEN created END DESC
OFFSET ((GREATEST(:page, 1) - 1) * :page_size) LIMIT :page_size;
