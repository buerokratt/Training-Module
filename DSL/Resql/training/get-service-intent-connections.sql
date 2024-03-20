SELECT intent,
      service,
      MAX(service_name) AS service_name
FROM service_trigger
GROUP BY intent, service
HAVING MAX(status) = 'approved';
