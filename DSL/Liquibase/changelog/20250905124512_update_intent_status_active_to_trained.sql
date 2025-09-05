-- liquibase formatted sql
-- changeset IgorKrupenja:20250905124512
-- todo check if works
-- todo fix all occurrneces
UPDATE intent SET status = 'NOT_TRAINED' WHERE status = 'ACTIVE';
