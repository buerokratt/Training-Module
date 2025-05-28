-- liquibase formatted sql
-- changeset athar-mt:20250529030320 ignore:true

-- 1. Create schemas
CREATE SCHEMA IF NOT EXISTS intent_management;
CREATE SCHEMA IF NOT EXISTS llm;


-- 2. Move tables to their respective schemas
-- intent_management schema
ALTER TABLE IF EXISTS public.intent SET SCHEMA intent_management;

-- llm schema
ALTER TABLE IF EXISTS public.llm_trainings SET SCHEMA llm;
ALTER TABLE IF EXISTS public.train_settings SET SCHEMA llm;


DO $$
DECLARE
    idx_record RECORD;
    intent_management_tables TEXT[] := ARRAY['intent'];
    llm_tables TEXT[] := ARRAY['llm_trainings', 'train_settings'];
    target_schema TEXT;
BEGIN
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
        WHERE t.relname = ANY(intent_management_tables || llm_tables)
        AND n.nspname = 'public'  -- Current schema of the tables
    LOOP
        -- Determine target schema based on which array the table is in
        IF idx_record.table_name = ANY(intent_management_tables) THEN
            target_schema := 'intent_management';
        ELSIF idx_record.table_name = ANY(llm_tables) THEN
            target_schema := 'llm';
        ELSE
            target_schema := NULL; -- Should not happen with our WHERE clause
        END IF;

        IF target_schema IS NULL THEN
            RAISE EXCEPTION 'No target schema found for table %', idx_record.table_name;
        END IF;
        EXECUTE format('ALTER INDEX %s SET SCHEMA %I', idx_record.idx_name, target_schema);
    END LOOP;
END $$;
