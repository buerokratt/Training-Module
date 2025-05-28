SELECT id, intent, status, created
FROM intent_management.intent
WHERE intent = :intent AND status = 'ACTIVE'
ORDER BY created DESC
LIMIT 1;
