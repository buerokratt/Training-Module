-- Insert new row for intent with updated status and/or isForService values
-- This finds the latest version of the intent and creates a new row with updated values
-- If :status is not provided, keeps the existing status
-- If :isForService is not provided, keeps the existing isForService
INSERT INTO intent (intent, created, status, isForService)
SELECT 
    :intent,
    CURRENT_TIMESTAMP,
    COALESCE(:status, latest_intent.status),
    COALESCE(:isForService, latest_intent.isForService)
FROM (
    -- Find the latest version of the specific intent
    SELECT DISTINCT ON (intent) 
        intent,
        status,
        isForService,
        created
    FROM intent
    WHERE intent = :intent
    ORDER BY intent, created DESC
) AS latest_intent;