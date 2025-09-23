-- Insert new rows for multiple intents with specified status
-- This finds the latest version of each intent and creates new rows with updated status
-- Expects :intents parameter to be an array of intent names and :status to be the new status
INSERT INTO intent (intent, created, status, isForService)
SELECT 
    intent_name,
    CURRENT_TIMESTAMP,
    :status,
    latest_intent.isForService
FROM (
    -- Unnest the array of intent names
    SELECT unnest(:intents) AS intent_name
) AS intent_list
JOIN (
    -- Find the latest version of each intent
    SELECT DISTINCT ON (intent) 
        intent,
        status,
        isForService,
        created
    FROM intent
    WHERE intent = ANY(:intents)
    ORDER BY intent, created DESC
) AS latest_intent ON latest_intent.intent = intent_list.intent_name;
