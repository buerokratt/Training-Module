-- liquibase formatted sql
-- changeset athar-mt:20250529030320 ignore:true

BEGIN;

-- 1. Move tables back to public schema
-- security schema
ALTER TABLE IF EXISTS security.request_nonces SET SCHEMA public;

-- intent_management schema
ALTER TABLE IF EXISTS intent_management.intent SET SCHEMA public;

-- llm schema
ALTER TABLE IF EXISTS llm.llm_trainings SET SCHEMA public;
ALTER TABLE IF EXISTS llm.train_settings SET SCHEMA public;

-- service_management schema
ALTER TABLE IF EXISTS service_management.service_trigger SET SCHEMA public;


-- 2. Drop schemas if empty
DROP SCHEMA IF EXISTS security;
DROP SCHEMA IF EXISTS intent_management;
DROP SCHEMA IF EXISTS llm;
DROP SCHEMA IF EXISTS service_management;

COMMIT;
