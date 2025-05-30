COPY (
    SELECT *
    FROM request_nonces
    WHERE used_at IS NULL AND nonce IN (
        SELECT nonce
        FROM request_nonces
        WHERE used_at IS NOT NULL
    ) AND created_at < %(export_boundary)s
) TO stdout WITH csv HEADER;
