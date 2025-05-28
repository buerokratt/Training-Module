WITH LatestStatus AS (
    SELECT intent,
           service,
           status,
           service_name,
           ROW_NUMBER() OVER (PARTITION BY intent, service ORDER BY created DESC) AS rn
    FROM service_management.service_trigger
)
SELECT intent,
       service,
       MAX(service_name) AS service_name
FROM LatestStatus
WHERE rn = 1 AND status = 'approved'
GROUP BY intent, service;
