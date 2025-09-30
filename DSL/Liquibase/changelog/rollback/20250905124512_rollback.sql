-- liquibase formatted sql
-- changeset IgorKrupenja:20250905124512-rollback

-- Rollback: Revert intent status from enum back to VARCHAR
-- This rollback reverses the changes made in 20250905124512_update_intent_status_active_to_trained.sql

-- First, change column type back to VARCHAR
ALTER TABLE intent ALTER COLUMN status TYPE VARCHAR(15);

-- Update data back to original values: NOT_TRAINED -> ACTIVE
-- Keep DELETED as is since it was already DELETED
UPDATE intent SET status = 'ACTIVE' WHERE status != 'DELETED';

ALTER TABLE intent ALTER COLUMN status TYPE VARCHAR(10);

-- Drop the enum type
DROP TYPE intent_status;
