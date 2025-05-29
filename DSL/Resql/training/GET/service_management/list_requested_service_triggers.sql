SELECT 
    intent,
    service,
    service_name,
    created AS requested_at,
    author_role,
    CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM service_trigger
WHERE 
    status = 'pending' 
    AND author_role != 'trainer'
    AND created = (
        SELECT MAX(created)
        FROM service_trigger st2
        WHERE st2.intent = service_trigger.intent 
        AND st2.service = service_trigger.service
    )
ORDER BY
    CASE WHEN :sorting = 'intent asc' THEN intent END ASC,
    CASE WHEN :sorting = 'intent desc' THEN intent END DESC,
    CASE WHEN :sorting = 'serviceName asc' THEN service_name END ASC,
    CASE WHEN :sorting = 'serviceName desc' THEN service_name END DESC,
    CASE WHEN :sorting = 'requestedAt asc' THEN created END ASC,
    CASE WHEN :sorting = 'requestedAt desc' THEN created END DESC
OFFSET ((GREATEST(:page, 1) - 1) * :page_size)
LIMIT :page_size;