SELECT intent, service
FROM service_trigger
GROUP BY intent, service
HAVING MAX(status) = 'approved';
