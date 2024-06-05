WITH Triggers AS (
  SELECT MAX(id) maxId
  FROM service_trigger
  GROUP BY intent, service
)
SELECT intent,
       service,
       service_name,
       created AS requested_at,
       author_role,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM service_trigger
JOIN Triggers ON id = maxId
WHERE status = 'pending'
AND author_role != 'trainer'
ORDER BY
   CASE WHEN :sorting = 'intent asc' THEN intent END ASC,
   CASE WHEN :sorting = 'intent desc' THEN intent END DESC,
   CASE WHEN :sorting = 'serviceName asc' THEN service_name END ASC,
   CASE WHEN :sorting = 'serviceName desc' THEN service_name END DESC,
   CASE WHEN :sorting = 'requestedAt asc' THEN created END ASC,
   CASE WHEN :sorting = 'requestedAt desc' THEN created END DESC
OFFSET ((GREATEST(:page, 1) - 1) * :page_size) LIMIT :page_size;
