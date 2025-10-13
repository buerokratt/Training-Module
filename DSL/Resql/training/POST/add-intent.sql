INSERT INTO intent (intent, created, status, isForService)
VALUES (:intent, CURRENT_TIMESTAMP, :status, false);
