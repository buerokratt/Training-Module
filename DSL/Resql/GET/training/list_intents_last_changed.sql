SELECT id, intent, created, isForService
FROM intent
WHERE (intent, created) IN (
    SELECT intent, MAX(created)
    FROM intent
    WHERE intent IN (:intentsList) AND status = 'ACTIVE'
    GROUP BY intent
)
ORDER BY created DESC;