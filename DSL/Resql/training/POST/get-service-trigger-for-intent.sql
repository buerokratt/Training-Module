SELECT id, intent, service, service_name, status, author_role, created
FROM service_trigger
WHERE intent = :intent
  AND created = (
    SELECT MAX(created)
    FROM service_trigger
    WHERE intent = :intent
  )
  AND status NOT IN ('deleted', 'declined');
