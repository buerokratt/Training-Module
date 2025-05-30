/*
declaration:
  version: 0.1
  description: "Fetch paginated and searchable list of deleted services by latest ID per service_id"
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
        enum: ['name asc', 'name desc']
        description: "Sort order for the service name"
      - field: search
        type: string
        description: "Optional search string to filter by service name"
  response:
    fields:
      - field: name
        type: string
        description: "Name of the service"
      - field: service_id
        type: string
        description: "Unique identifier of the service"
      - field: total_pages
        type: integer
        description: "Total number of result pages based on page size"
*/
SELECT
    name,
    service_id,
    CEIL(COUNT(*) OVER () / :page_size::DECIMAL) AS total_pages
FROM services AS s_1
WHERE
    updated_at = (
        SELECT MAX(updated_at)
        FROM services AS s_2
        WHERE s_1.service_id = s_2.service_id
    )
    AND deleted IS NOT NULL
    AND (:search IS NULL OR :search = '' OR name LIKE ('%' || :search || '%'))
ORDER BY
    CASE WHEN :sorting = 'name asc' THEN name END ASC,
    CASE WHEN :sorting = 'name desc' THEN name END DESC
OFFSET ((GREATEST(:page, 1) - 1) * :page_size) LIMIT :page_size;
