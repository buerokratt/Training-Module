SELECT id, intent, status, created
FROM intent
WHERE intent = :intent AND status = 'ACTIVE'
ORDER BY created DESC
LIMIT 1;
