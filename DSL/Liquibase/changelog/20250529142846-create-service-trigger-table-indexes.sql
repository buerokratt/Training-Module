-- liquibase formatted sql
-- changeset ahmer-mt:20250529142846 ignore:true
CREATE INDEX idx_service_trigger_status_author_role ON service_trigger (status, author_role);
CREATE INDEX idx_service_trigger_intent_service_created ON service_trigger (intent, service, created DESC);
CREATE INDEX idx_service_trigger_intent ON service_trigger (intent);
CREATE INDEX idx_service_trigger_service_name ON service_trigger (service_name);
CREATE INDEX idx_service_trigger_created ON service_trigger (created);
