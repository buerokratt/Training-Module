-- liquibase formatted sql
-- changeset Janno Stern:1717050863
ALTER TABLE llm_trainings
ADD COLUMN training_data_checksum VARCHAR(64);