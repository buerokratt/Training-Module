-- liquibase formatted sql
-- changeset Vassili Moskaljov:1717050740
ALTER TABLE intent ADD COLUMN isForService BOOLEAN DEFAULT FALSE;