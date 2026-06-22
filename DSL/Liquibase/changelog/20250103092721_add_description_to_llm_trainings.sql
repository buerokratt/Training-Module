-- liquibase formatted sql
-- changeset ahmedyasser:20250103092721
ALTER TABLE llm_trainings
ADD COLUMN description TEXT;
