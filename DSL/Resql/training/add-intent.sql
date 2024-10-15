INSERT INTO intent (intent, created, status, isService)
VALUES (:intent, CURRENT_TIMESTAMP, :status, false);
