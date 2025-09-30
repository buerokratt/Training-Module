-- liquibase formatted sql
-- changeset IgorKrupenja:20250905124512

-- Create enum type for intent status
CREATE TYPE intent_status AS ENUM ('TRAINED', 'NOT_TRAINED', 'DELETED');

-- First, increase the column length to accommodate 'NOT_TRAINED' (11 characters)
ALTER TABLE intent ALTER COLUMN status TYPE VARCHAR(15);

-- Update existing data: ACTIVE -> NOT_TRAINED
-- Also updates all other possible status values
-- Those would actually be invalid but still possible since we were not using an enum previously
UPDATE intent SET status = 'NOT_TRAINED' WHERE status != 'DELETED';

-- Change column type to use the new enum
ALTER TABLE intent ALTER COLUMN status TYPE intent_status USING status::intent_status;
