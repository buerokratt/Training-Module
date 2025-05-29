INSERT INTO intent (intent, created, status, isForService)
VALUES (:intent, CURRENT_TIMESTAMP, UPPER(:status)::intent_status_type, :isForService);