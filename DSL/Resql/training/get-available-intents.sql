WITH connected_intents AS
   (SELECT intent,
           service,
           service_name,
           max(status) AS status,
           max(created) AS created
    FROM service_trigger
    GROUP BY intent,
             service,
             service_name
    HAVING max(status) = 'pending'
    OR max(status) = 'approved')
 SELECT intent
 FROM intent
 WHERE intent NOT IN
     (SELECT intent
      FROM connected_intents)
 ORDER BY intent ASC