UPDATE appeal a
SET a.appeal = :newAppeal,
    intent = :intent
WHERE a.name = :oldAppeal;