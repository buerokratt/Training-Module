DELETE FROM intent
WHERE (intent, created) NOT IN (
       SELECT intent, max(created)
       FROM intent
       GROUP BY intent
) AND created < %(export_boundary)s;
