-- liquibase formatted sql
-- changeset athar-mt:20250530152658 ignore:true

-- 1. Create schemas
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS intent_management;
CREATE SCHEMA IF NOT EXISTS llm;
CREATE SCHEMA IF NOT EXISTS service_management;


-- 2. Move tables to their respective schemas
-- security schema
ALTER TABLE IF EXISTS public.request_nonces SET SCHEMA security;

-- intent_management schema
ALTER TABLE IF EXISTS public.intent SET SCHEMA intent_management;

-- llm schema
ALTER TABLE IF EXISTS public.llm_trainings SET SCHEMA llm;
ALTER TABLE IF EXISTS public.train_settings SET SCHEMA llm;

-- service_management schema
ALTER TABLE IF EXISTS public.service_trigger SET SCHEMA service_management;

