SELECT id, intent, created, isForService
FROM intent_management.intent
WHERE (intent, created) IN (
    SELECT intent, MAX(created)
    FROM intent_management.intent
    WHERE intent IN (:intentsList) AND status = 'ACTIVE'
    GROUP BY intent
)
ORDER BY created DESC;