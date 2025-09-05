-- Insert new row for intent with updated isForService value
-- This finds the latest version of the intent and creates a new row with updated isForService
INSERT INTO intent (intent, created, status, isForService)
SELECT 
    :intent,
    CURRENT_TIMESTAMP,
    latest_intent.status,
    :isForService
FROM (
    -- Find the latest version of the specific intent
    SELECT DISTINCT ON (intent) 
        intent,
        status,
        created
    FROM intent
    WHERE intent = :intent
    ORDER BY intent, created DESC
) AS latest_intent;