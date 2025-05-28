INSERT INTO intent_management.intent (intent, created, status, isForService)
VALUES (:intent, CURRENT_TIMESTAMP, :status, :isForService);