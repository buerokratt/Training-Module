SELECT
  name,
  service_id,
  CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM services
WHERE id IN (
  SELECT max(id)
  FROM services
  GROUP BY service_id
)
AND deleted IS NOT NULL
AND (:search IS NULL OR :search = '' OR name LIKE ('%' || :search || '%'))
ORDER BY
  CASE WHEN :sorting = 'name asc' THEN name END ASC,
  CASE WHEN :sorting = 'name desc' THEN name END DESC
OFFSET ((GREATEST(:page, 1) - 1) * :page_size) LIMIT :page_size;