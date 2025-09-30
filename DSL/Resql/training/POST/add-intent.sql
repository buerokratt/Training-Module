-- Insert new row for intent preserving existing status
-- This finds the latest version of the intent and creates a new row with preserved status
INSERT INTO intent (intent, created, status, isForService)
SELECT 
    :intent,
    CURRENT_TIMESTAMP,
    COALESCE(latest_intent.status, :status),
    false
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
