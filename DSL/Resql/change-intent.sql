UPDATE intent
SET end_date = CURRENT_TIMESTAMP
WHERE intent = :intent;
AND end_date IS NULL
ORDER BY start_date DESC
LIMIT 1;


INSERT INTO intent (intent, start_date)
VALUES (:intent, CURRENT_TIMESTAMP);
