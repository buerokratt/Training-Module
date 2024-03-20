SELECT intent,
       service,
       MAX(service_name) AS service_name,
       MAX(created) AS requested_at,
       MAX(author_role) as author_role 
FROM service_trigger
GROUP BY intent, service
HAVING MAX(status) = 'pending'
AND MAX("author_role") != 'trainer';
