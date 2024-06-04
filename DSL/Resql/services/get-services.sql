WITH MaxServices AS (
	SELECT max(id) AS maxId
	FROM services
	GROUP BY service_id
)
SELECT
  name,
  service_id,
  CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM services
JOIN MaxServices ON maxId = id
WHERE deleted IS NOT NULL
AND (:search IS NULL OR :search = '' OR name LIKE ('%' || :search || '%'))
ORDER BY
  CASE WHEN :sorting = 'name asc' THEN name END ASC,
  CASE WHEN :sorting = 'name desc' THEN name END DESC
OFFSET ((GREATEST(:page, 1) - 1) * :page_size) LIMIT :page_size;
