SELECT copy_row_with_modifications(
    'security.request_nonces',
    'nonce', '', nonce,
    ARRAY['used_at', '::TIMESTAMP', NOW()::VARCHAR]::VARCHAR[]
) as nonce FROM security.request_nonces
WHERE nonce = :updated_nonce AND used_at IS null;
