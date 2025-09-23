-- todo unused for now
-- todo need to be used with on model switch but with list of intents provided
-- Insert new rows for intents that are not DELETED and not already TRAINED, setting status to TRAINED
-- This finds the latest version of each intent and creates a new row with TRAINED status
INSERT INTO intent (intent, created, status, isForService)
SELECT 
    latest_intents.intent,
    CURRENT_TIMESTAMP,
    'TRAINED',
    latest_intents.isForService
FROM (
    -- Find the latest version of each intent
    SELECT DISTINCT ON (intent) 
        intent,
        isForService,
        created,
        status
    FROM intent
    ORDER BY intent, created DESC
) AS latest_intents
WHERE latest_intents.status NOT IN ('DELETED', 'TRAINED');
