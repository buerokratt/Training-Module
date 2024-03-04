WITH connected_intents AS
  (SELECT intent,
          service,
          service_name,
          status,
          created
   FROM service_trigger
   WHERE (intent,
          service,
          service_name,
          created) IN
       (SELECT intent,
               service,
               service_name,
               max(created)
        FROM service_trigger
        GROUP BY intent,
                 service,
                 service_name)
     AND status in ('pending',
                    'approved'))
SELECT intent
FROM intent
WHERE intent NOT IN
    (SELECT intent
     FROM connected_intents)
ORDER BY intent ASC