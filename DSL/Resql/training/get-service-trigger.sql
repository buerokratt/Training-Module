SELECT id, intent, service, service_name, status, author_role, created
 FROM service_trigger
 WHERE service = :serviceId
   AND id = (
     SELECT MAX(id)
     FROM service_trigger
     WHERE service = :serviceId
   )
   AND status NOT IN ('deleted', 'declined');