-- liquibase formatted sql
-- changeset Janno Stern:1714129362
ALTER TABLE llm_trainings
ADD COLUMN cross_validation_report text;