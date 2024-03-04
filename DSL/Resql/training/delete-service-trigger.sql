INSERT INTO service_trigger (intent, service, status, author_role, service_name)
VALUES (:intent, :serviceId, 'deleted'::trigger_status, :authorRole::author_role, :serviceName)