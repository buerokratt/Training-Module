-- liquibase formatted sql
-- changeset ahmer-mt:20250529142837 ignore:true
CREATE INDEX idx_intent_intent_status_created ON intent (intent, status, created DESC);
