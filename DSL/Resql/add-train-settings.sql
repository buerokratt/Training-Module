INSERT INTO "train-settings" (folds, scheduled, daysOfWeek, fromDate)
VALUES (:folds, :scheduled, :daysofweek, TO_TIMESTAMP(:fromdate,'YYYY-MM-DD"T"HH24:MI:SS'));