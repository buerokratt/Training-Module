-- liquibase formatted sql
-- changeset ahmedyasser:1708882370
CREATE TABLE intent (
  id BIGSERIAL PRIMARY KEY,
  intent VARCHAR(250) NOT NULL,
  status VARCHAR(10) NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
