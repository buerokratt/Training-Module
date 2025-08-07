/*
declaration:
  version: 0.1
  description: "Create new request nonce"
  method: post
  accepts: json
  returns: json
  namespace: security
  allowlist:
    body: []
  response:
    fields:
      - field: nonce
        type: string
        description: "The nonce that was marked as used"
*/
INSERT INTO security.request_nonces (valid_until)
VALUES ( now() + interval '1 day')
RETURNING nonce;