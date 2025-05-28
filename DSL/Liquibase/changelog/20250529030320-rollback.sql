-- liquibase formatted sql
-- changeset athar-mt:20250529030320 ignore:true

BEGIN;

-- 1. Move tables back to public schema
-- intent_management schema
ALTER TABLE IF EXISTS intent_management.intent SET SCHEMA public;

-- llm schema
ALTER TABLE IF EXISTS llm.llm_trainings SET SCHEMA public;
ALTER TABLE IF EXISTS llm.train_settings SET SCHEMA public;


-- 2. Drop schemas if empty
DROP SCHEMA IF EXISTS intent_management;
DROP SCHEMA IF EXISTS llm;

DO $$
DECLARE
    idx_record RECORD;
    all_tables TEXT[] := ARRAY[
        -- intent_management schema tables
        'intent',
        -- llm schema tables
        'llm_trainings', 'train_settings',
    ];
    schemas TEXT[] := ARRAY['intent_management', 'llm'];
BEGIN
    -- Loop through each schema that might contain our indexes
    FOREACH schema_name IN ARRAY schemas
    LOOP
        -- For each table, find all its indexes in the non-public schema
        FOR idx_record IN 
            SELECT 
                t.relname AS table_name,
                indexrelid::regclass AS idx_name,
                idx_ns.nspname AS current_schema
            FROM pg_index i
            JOIN pg_class t ON i.indrelid = t.oid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            JOIN pg_class idx ON i.indexrelid = idx.oid
            JOIN pg_namespace idx_ns ON idx.relnamespace = idx_ns.oid
            WHERE t.relname = ANY(all_tables)
            AND idx_ns.nspname = schema_name  -- Only indexes in the specified schema
        LOOP
            EXECUTE format('ALTER INDEX %s SET SCHEMA public', idx_record.idx_name);
        END LOOP;
    END LOOP;
END $$;

COMMIT;
