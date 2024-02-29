SELECT id, name, description, service_id
FROM service
WHERE current_state = 'active'