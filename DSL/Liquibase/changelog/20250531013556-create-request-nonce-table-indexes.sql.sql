-- liquibase formatted sql
-- changeset ahmer-mt:20250531013556 ignore:true
CREATE INDEX idx_request_nonces_nonce_created_used
ON security.request_nonces (nonce, created_at DESC, used_at);
