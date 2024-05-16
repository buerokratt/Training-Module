-- liquibase formatted sql
-- changeset Janno Stern:1715857582
ALTER TABLE llm_trainings
ADD COLUMN cross_validation_report text;