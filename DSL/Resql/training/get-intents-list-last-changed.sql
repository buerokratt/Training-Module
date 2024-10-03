SELECT i.id, i.intent, i.created
FROM intent i
INNER JOIN (
    SELECT intent, MAX(created) AS max_created
    FROM intent
    WHERE intent IN (:intentsList) AND status = 'ACTIVE'
    GROUP BY intent
) subquery ON i.intent = subquery.intent AND i.created = subquery.max_created
ORDER BY i.created DESC;