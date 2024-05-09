INSERT INTO intent (intent, created, status)
VALUES (:intent, CURRENT_TIMESTAMP, :status)
ON CONFLICT (id) DO UPDATE
SET intent = EXCLUDED.intent,
    created = EXCLUDED.created,
    status = EXCLUDED.status;
