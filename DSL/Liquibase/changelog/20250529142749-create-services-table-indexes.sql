-- liquibase formatted sql
-- changeset ahmer-mt:20250529142749 ignore:true
CREATE INDEX idx_services_name_trgm ON services USING gin (name gin_trgm_ops);
CREATE INDEX idx_services_service_id_updated_at ON services (service_id, updated_at DESC);

-- NOT USED
-- CREATE INDEX idx_services_deleted ON services (deleted);
-- CREATE INDEX idx_services_name ON services (name);
