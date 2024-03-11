INSERT INTO service_trigger (intent, service, status, author_role, service_name)
VALUES (:intent, :serviceId, :status::trigger_status, :authorRole::author_role, :serviceName)
RETURNING intent, service, status, service_name, author_role, created AS requested_at;
