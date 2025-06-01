-- liquibase formatted sql
-- changeset Artsiom Beida:20250529165345 ignore:true
ALTER TABLE intent ALTER COLUMN intent TYPE TEXT;
ALTER TABLE intent ALTER COLUMN status TYPE TEXT;

ALTER TABLE llm_trainings ALTER COLUMN model_type TYPE TEXT;
ALTER TABLE llm_trainings ALTER COLUMN state TYPE TEXT;
ALTER TABLE llm_trainings ALTER COLUMN file_name TYPE TEXT;
ALTER TABLE llm_trainings ALTER COLUMN version_number TYPE TEXT;
ALTER TABLE llm_trainings ALTER COLUMN model_version TYPE TEXT;
ALTER TABLE llm_trainings ALTER COLUMN training_data_checksum TYPE TEXT;

ALTER TABLE request_nonces ALTER COLUMN nonce TYPE TEXT;


ALTER TABLE service_trigger ALTER COLUMN intent TYPE TEXT;
ALTER TABLE service_trigger ALTER COLUMN service TYPE TEXT;
ALTER TABLE service_trigger ALTER COLUMN service_name TYPE TEXT;

ALTER TABLE train_settings ALTER COLUMN days_of_week TYPE TEXT;
ALTER TABLE train_settings ALTER COLUMN modifier_id TYPE TEXT;
ALTER TABLE train_settings ALTER COLUMN modifier_name TYPE TEXT;

