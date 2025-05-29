-- liquibase formatted sql
-- changeset ahmer-mt:20250529142801 ignore:true
ALTER TABLE llm_trainings ALTER COLUMN created SET DEFAULT now();

CREATE INDEX idx_llm_trainings_state_trained_date ON llm_trainings (state, trained_date DESC);
CREATE INDEX idx_llm_trainings_version_created ON llm_trainings (version_number, created DESC);
CREATE INDEX idx_llm_trainings_version_array ON llm_trainings ((string_to_array(version_number, '_')::int[]) DESC);
CREATE INDEX idx_llm_trainings_trained_date ON llm_trainings (trained_date DESC);
CREATE INDEX idx_llm_trainings_version_state ON llm_trainings (version_number, state);
CREATE INDEX idx_llm_trainings_filename ON llm_trainings (file_name);
CREATE INDEX idx_llm_trainings_filename_created ON llm_trainings (file_name, created DESC);
CREATE INDEX idx_llm_trainings_state_created ON llm_trainings (state, created DESC);
