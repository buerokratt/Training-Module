UPDATE "train-settings" ts
SET ts.scheduled = :scheduled,
    ts.folds = :folds,
    ts.daysOfWeek = :dayOfWeek,
    ts.from = :from,
 WHERE ts.id = (
    SELECT ts.id
    FROM "train-settings" ts
    ORDER BY ts.id
    LIMIT 1);