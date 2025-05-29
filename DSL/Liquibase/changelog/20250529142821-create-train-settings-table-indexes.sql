-- liquibase formatted sql
-- changeset ahmer-mt:20250529142821 ignore:true
ALTER TABLE train_settings ALTER COLUMN last_modified SET DEFAULT now();

CREATE INDEX idx_train_settings_last_modified ON train_settings (last_modified DESC);
