SELECT id, intent, status, created
FROM intent
WHERE intent = :intent AND status != 'DELETED'
ORDER BY created DESC
LIMIT 1;
