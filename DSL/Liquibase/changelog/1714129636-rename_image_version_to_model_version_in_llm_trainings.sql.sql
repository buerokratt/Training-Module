-- liquibase formatted sql
-- changeset Janno Stern:1714129636
ALTER TABLE llm_trainings 
RENAME COLUMN image_version TO model_version;