-- liquibase formatted sql
-- changeset ahmer-mt:20250529152204 ignore:true
-- Begin transaction
BEGIN;

-- 1. Create ENUM types for intent status and llm_trainings state
CREATE TYPE intent_status_type AS ENUM (
    'ACTIVE',
    'DELETED'
);

-- LLM trainings state ENUM
CREATE TYPE llm_training_state_type AS ENUM (
    'ACTIVATING',
    'ALREADY_TRAINED',
    'CROSS_VALIDATING',
    'DELETED',
    'DEPLOYED',
    'ERROR',
    'PROCESSING',
    'READY',
    'TESTING'
);

-- 2. Create helper functions for conversions

-- Function for case-insensitive intent status conversion
CREATE OR REPLACE FUNCTION convert_to_uppercase_intent_status(input_text VARCHAR) 
RETURNS intent_status_type AS '
DECLARE
    uppercase_input VARCHAR := upper(input_text);
BEGIN
    -- Try to cast the uppercase version to intent_status_type
    BEGIN
        RETURN uppercase_input::intent_status_type;
    EXCEPTION WHEN OTHERS THEN
        -- If casting fails, return NULL
        RETURN NULL;
    END;
END;
' LANGUAGE plpgsql;

-- Function for llm_training_state conversion (already uppercase)
CREATE OR REPLACE FUNCTION convert_to_llm_training_state(input_text VARCHAR) 
RETURNS llm_training_state_type AS '
BEGIN
    -- Try to cast directly to llm_training_state_type
    BEGIN
        RETURN input_text::llm_training_state_type;
    EXCEPTION WHEN OTHERS THEN
        -- If casting fails, return NULL
        RETURN NULL;
    END;
END;
' LANGUAGE plpgsql;

-- 3. Update tables to use the new types

-- Update intent.status with case-insensitive conversion
ALTER TABLE public.intent 
ADD COLUMN status_enum intent_status_type;

UPDATE public.intent 
SET status_enum = convert_to_uppercase_intent_status(status)
WHERE status IS NOT NULL;

-- Set NOT NULL constraint on the new column
ALTER TABLE public.intent 
ALTER COLUMN status_enum SET NOT NULL;

ALTER TABLE public.intent 
DROP COLUMN status;

ALTER TABLE public.intent 
RENAME COLUMN status_enum TO status;

-- 4. Recreate indexes with the new column types
DROP INDEX IF EXISTS idx_intent_intent_status_created;
CREATE INDEX idx_intent_intent_status_created 
ON public.intent (intent, status, created DESC);

-- Update llm_trainings.state
ALTER TABLE public.llm_trainings 
ADD COLUMN state_enum llm_training_state_type;

UPDATE public.llm_trainings 
SET state_enum = convert_to_llm_training_state(state)
WHERE state IS NOT NULL;

-- Set NOT NULL constraint on the new column
ALTER TABLE public.llm_trainings 
ALTER COLUMN state_enum SET NOT NULL;

ALTER TABLE public.llm_trainings 
DROP COLUMN state;

ALTER TABLE public.llm_trainings 
RENAME COLUMN state_enum TO state;

-- Recreate indexes for llm_trainings.state
DROP INDEX IF EXISTS idx_llm_trainings_state_created;
CREATE INDEX idx_llm_trainings_state_created 
ON public.llm_trainings (state, created DESC);

DROP INDEX IF EXISTS idx_llm_trainings_state_trained_date;
CREATE INDEX idx_llm_trainings_state_trained_date 
ON public.llm_trainings (state, trained_date DESC);

DROP INDEX IF EXISTS idx_llm_trainings_version_state;
CREATE INDEX idx_llm_trainings_version_state 
ON public.llm_trainings (version_number, state);

-- 5. Drop the helper functions as they're no longer needed
DROP FUNCTION IF EXISTS convert_to_uppercase_intent_status;
DROP FUNCTION IF EXISTS convert_to_llm_training_state;

-- Commit all changes
COMMIT;