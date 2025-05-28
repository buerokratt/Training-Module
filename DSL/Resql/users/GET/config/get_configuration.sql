SELECT id, key, value, deleted, created
FROM config.configuration
WHERE key=:key
AND id IN (SELECT max(id) from config.configuration GROUP BY key)
AND NOT deleted;
