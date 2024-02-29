-- liquibase formatted sql
-- changeset ahmedyasser:1709167491
ALTER TABLE service_trigger
ADD COLUMN service_name VARCHAR NOT NULL;
