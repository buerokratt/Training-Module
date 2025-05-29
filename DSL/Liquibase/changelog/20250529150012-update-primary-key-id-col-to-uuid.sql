-- liquibase formatted sql
-- changeset ahmer-mt:20250529150012 ignore:true
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Begin transaction to ensure all changes are atomic
BEGIN;

ALTER TABLE intent 
  ADD COLUMN uuid_id UUID DEFAULT gen_random_uuid();
UPDATE intent SET uuid_id = gen_random_uuid();
ALTER TABLE intent DROP CONSTRAINT IF EXISTS intent_id_key;
ALTER TABLE intent DROP COLUMN id;
ALTER TABLE intent RENAME COLUMN uuid_id TO id;
ALTER TABLE intent ADD PRIMARY KEY (id);

ALTER TABLE llm_trainings 
  ADD COLUMN uuid_id UUID DEFAULT gen_random_uuid();
UPDATE llm_trainings SET uuid_id = gen_random_uuid();
ALTER TABLE llm_trainings DROP CONSTRAINT IF EXISTS llm_trainings_id_key;
ALTER TABLE llm_trainings DROP COLUMN id;
ALTER TABLE llm_trainings RENAME COLUMN uuid_id TO id;
ALTER TABLE llm_trainings ADD PRIMARY KEY (id);

ALTER TABLE train_settings 
  ADD COLUMN uuid_id UUID DEFAULT gen_random_uuid();
UPDATE train_settings SET uuid_id = gen_random_uuid();
ALTER TABLE train_settings DROP CONSTRAINT IF EXISTS train_settings_id_key;
ALTER TABLE train_settings DROP COLUMN id;
ALTER TABLE train_settings RENAME COLUMN uuid_id TO id;
ALTER TABLE train_settings ADD PRIMARY KEY (id);

ALTER TABLE service_trigger 
  ADD COLUMN uuid_id UUID DEFAULT gen_random_uuid();
UPDATE service_trigger SET uuid_id = gen_random_uuid();
ALTER TABLE service_trigger DROP CONSTRAINT IF EXISTS service_trigger_id_key;
ALTER TABLE service_trigger DROP COLUMN id;
ALTER TABLE service_trigger RENAME COLUMN uuid_id TO id;
ALTER TABLE service_trigger ADD PRIMARY KEY (id);

COMMIT;