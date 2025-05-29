-- liquibase formatted sql
-- changeset ahmer-mt:20250529142749 ignore:true
DROP INDEX idx_services_name_trgm;
DROP INDEX idx_services_service_id_updated_at;

-- NOT USED
-- DROP INDEX idx_services_deleted;
-- DROP INDEX idx_services_name;
