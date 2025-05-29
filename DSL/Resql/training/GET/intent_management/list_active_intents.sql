SELECT DISTINCT ON (intent) id, intent, created, isForService
FROM intent
WHERE intent IN (:intentsList) AND status = 'ACTIVE'
ORDER BY intent, created DESC;