-- liquibase formatted sql
-- changeset ahmer-mt:20250529142801 ignore:true
DROP INDEX idx_llm_trainings_state_trained_date;
DROP INDEX idx_llm_trainings_version_created;
DROP INDEX idx_llm_trainings_version_array;
DROP INDEX idx_llm_trainings_trained_date;
DROP INDEX idx_llm_trainings_version_state;
DROP INDEX idx_llm_trainings_filename;
DROP INDEX idx_llm_trainings_filename_created;
DROP INDEX idx_llm_trainings_state_created;
