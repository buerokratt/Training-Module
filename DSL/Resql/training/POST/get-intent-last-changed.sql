SELECT id, intent, status, created, isForService
FROM intent
WHERE intent = :intent AND status = 'ACTIVE'
ORDER BY created DESC
LIMIT 1;
