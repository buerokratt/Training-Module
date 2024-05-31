SELECT intent,
       service,
       MAX(service_name) AS service_name,
       MAX(created) AS requested_at,
       MAX(author_role) as author_role,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM service_trigger
GROUP BY intent, service
HAVING MAX(status) = 'pending'
AND MAX("author_role") != 'trainer'
ORDER BY
   CASE WHEN :sorting = 'intent asc' THEN intent END ASC,
   CASE WHEN :sorting = 'intent desc' THEN intent END DESC,
   CASE WHEN :sorting = 'serviceName asc' THEN MAX(service_name) END ASC,
   CASE WHEN :sorting = 'serviceName desc' THEN MAX(service_name) END DESC,
   CASE WHEN :sorting = 'requestedAt asc' THEN MAX(created) END ASC,
   CASE WHEN :sorting = 'requestedAt desc' THEN MAX(created) END DESC
OFFSET ((GREATEST(:page, 1) - 1) * :page_size) LIMIT :page_size;
