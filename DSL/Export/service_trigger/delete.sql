DELETE FROM service_trigger
WHERE (intent, service, created) NOT IN (
       SELECT intent, service, max(created)
       FROM service_trigger
       GROUP BY (intent, service)
) AND created < %(export_boundary)s;
