INSERT INTO request_nonces (valid_until) VALUES ( now() + interval '1 day') RETURNING nonce;
