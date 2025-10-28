-- Update intent name by inserting a new record with the new name and copying over status and isForService from the old record.
-- Expects :oldIntent and :newIntent parameters.
INSERT INTO intent (intent, status, isForService, created)
SELECT
    :newIntent,
    status,
    isForService,
    CURRENT_TIMESTAMP
FROM intent
WHERE intent = :oldIntent
ORDER BY created DESC
LIMIT 1;
