-- liquibase formatted sql
-- changeset jannostern:1760425555

-- Increase the column length to accommodate 'NOT_TRAINED' (11 characters)
ALTER TABLE intent ALTER COLUMN status TYPE VARCHAR(15);
