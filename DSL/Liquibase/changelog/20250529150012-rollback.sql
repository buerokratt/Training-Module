-- liquibase formatted sql
-- changeset ahmer-mt:20250529150012-rollback ignore:true

-- Begin transaction to ensure all changes are atomic
BEGIN;

-- Create sequences for auto-incrementing IDs
CREATE SEQUENCE IF NOT EXISTS intent_id_seq;
CREATE SEQUENCE IF NOT EXISTS llm_trainings_id_seq;
CREATE SEQUENCE IF NOT EXISTS train_settings_id_seq;
CREATE SEQUENCE IF NOT EXISTS service_trigger_id_seq;

-- Rollback service_trigger table
ALTER TABLE service_trigger ADD COLUMN bigint_id BIGINT DEFAULT nextval('service_trigger_id_seq');
UPDATE service_trigger SET bigint_id = nextval('service_trigger_id_seq');
ALTER TABLE service_trigger DROP CONSTRAINT IF EXISTS service_trigger_pkey;
ALTER TABLE service_trigger DROP COLUMN id;
ALTER TABLE service_trigger RENAME COLUMN bigint_id TO id;
ALTER TABLE service_trigger ADD PRIMARY KEY (id);
ALTER TABLE service_trigger ALTER COLUMN id SET DEFAULT nextval('service_trigger_id_seq');

-- Rollback train_settings table
ALTER TABLE train_settings ADD COLUMN bigint_id BIGINT DEFAULT nextval('train_settings_id_seq');
UPDATE train_settings SET bigint_id = nextval('train_settings_id_seq');
ALTER TABLE train_settings DROP CONSTRAINT IF EXISTS train_settings_pkey;
ALTER TABLE train_settings DROP COLUMN id;
ALTER TABLE train_settings RENAME COLUMN bigint_id TO id;
ALTER TABLE train_settings ADD PRIMARY KEY (id);
ALTER TABLE train_settings ALTER COLUMN id SET DEFAULT nextval('train_settings_id_seq');

-- Rollback llm_trainings table
ALTER TABLE llm_trainings ADD COLUMN bigint_id BIGINT DEFAULT nextval('llm_trainings_id_seq');
UPDATE llm_trainings SET bigint_id = nextval('llm_trainings_id_seq');
ALTER TABLE llm_trainings DROP CONSTRAINT IF EXISTS llm_trainings_pkey;
ALTER TABLE llm_trainings DROP COLUMN id;
ALTER TABLE llm_trainings RENAME COLUMN bigint_id TO id;
ALTER TABLE llm_trainings ADD PRIMARY KEY (id);
ALTER TABLE llm_trainings ALTER COLUMN id SET DEFAULT nextval('llm_trainings_id_seq');

-- Rollback intent table
ALTER TABLE intent ADD COLUMN bigint_id BIGINT DEFAULT nextval('intent_id_seq');
UPDATE intent SET bigint_id = nextval('intent_id_seq');
ALTER TABLE intent DROP CONSTRAINT IF EXISTS intent_pkey;
ALTER TABLE intent DROP COLUMN id;
ALTER TABLE intent RENAME COLUMN bigint_id TO id;
ALTER TABLE intent ADD PRIMARY KEY (id);
ALTER TABLE intent ALTER COLUMN id SET DEFAULT nextval('intent_id_seq');

-- Set sequence values to appropriate values to avoid conflicts
-- This gets the max ID from each table and sets the sequence to start after that max value
SELECT setval('intent_id_seq', COALESCE((SELECT MAX(id) FROM intent), 0) + 1, false);
SELECT setval('llm_trainings_id_seq', COALESCE((SELECT MAX(id) FROM llm_trainings), 0) + 1, false);
SELECT setval('train_settings_id_seq', COALESCE((SELECT MAX(id) FROM train_settings), 0) + 1, false);
SELECT setval('service_trigger_id_seq', COALESCE((SELECT MAX(id) FROM service_trigger), 0) + 1, false);

-- Commit all changes
COMMIT;

-- WARNING: Rolling back will result in data loss of the UUID values and generate new BIGINT IDs.
-- Any foreign key references to these UUIDs will be broken and need to be handled separately.