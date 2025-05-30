-- liquibase formatted sql
-- changeset ahmer-mt:20250529152204 ignore:true
BEGIN;

-- 1. Rollback intent table changes

-- Drop indexes that use the enum type
DROP INDEX IF EXISTS idx_intent_intent_status_created;

-- Convert intent.status back to text
ALTER TABLE public.intent 
ADD COLUMN status_text TEXT;

UPDATE public.intent 
SET status_text = status::TEXT
WHERE status IS NOT NULL;

-- Set NOT NULL constraint on the text column
ALTER TABLE public.intent 
ALTER COLUMN status_text SET NOT NULL;

ALTER TABLE public.intent 
DROP COLUMN status;

ALTER TABLE public.intent 
RENAME COLUMN status_text TO status;

-- Recreate original index for intent
CREATE INDEX idx_intent_intent_status_created 
ON public.intent (intent, status, created DESC);

-- 2. Rollback llm_trainings table changes

-- Drop indexes that use the enum type
DROP INDEX IF EXISTS idx_llm_trainings_state_created;
DROP INDEX IF EXISTS idx_llm_trainings_state_trained_date;
DROP INDEX IF EXISTS idx_llm_trainings_version_state;

-- Convert llm_trainings.state back to text
ALTER TABLE public.llm_trainings 
ADD COLUMN state_text TEXT;

UPDATE public.llm_trainings 
SET state_text = state::TEXT
WHERE state IS NOT NULL;

-- Set NOT NULL constraint on the text column
ALTER TABLE public.llm_trainings 
ALTER COLUMN state_text SET NOT NULL;

ALTER TABLE public.llm_trainings 
DROP COLUMN state;

ALTER TABLE public.llm_trainings 
RENAME COLUMN state_text TO state;

-- Recreate original indexes for llm_trainings
CREATE INDEX idx_llm_trainings_state_created 
ON public.llm_trainings (state, created DESC);

CREATE INDEX idx_llm_trainings_state_trained_date 
ON public.llm_trainings (state, trained_date DESC);

CREATE INDEX idx_llm_trainings_version_state 
ON public.llm_trainings (version_number, state);

-- 3. Drop the enum types
DROP TYPE IF EXISTS intent_status_type;
DROP TYPE IF EXISTS llm_training_state_type;

-- Commit rollback changes
COMMIT;