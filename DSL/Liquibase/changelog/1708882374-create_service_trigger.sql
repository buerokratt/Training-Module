-- liquibase formatted sql
-- changeset ahmedyasser:1708882374
CREATE TYPE trigger_status AS ENUM ('pending','deleted', 'declined', 'approved');
CREATE TYPE author_role AS ENUM ('trainer', 'service_manager', 'admin');

CREATE TABLE service_trigger (
  id BIGSERIAL PRIMARY KEY,
  intent VARCHAR NOT NULL,
  service VARCHAR NOT NULL,
  status trigger_status NOT NULL DEFAULT 'pending',
  author_role author_role NOT NULL DEFAULT 'trainer',
  created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
