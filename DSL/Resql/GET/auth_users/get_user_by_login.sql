/*
declaration:
  version: 0.1
  description: "Authenticate user by login and password, returning profile data if user has authorities"
  method: get
  namespace: auth_users
  returns: json
  allowlist:
    query:
      - field: login
        type: string
        description: "User login name"
      - field: password
        type: string
        description: "Hashed user password"
  response:
    fields:
      - field: login
        type: string
        description: "User's login"
      - field: first_name
        type: string
        description: "User's first name"
      - field: last_name
        type: string
        description: "User's last name"
      - field: id_code
        type: string
        description: "Unique identifier for the user"
      - field: display_name
        type: string
        description: "Full display name"
      - field: authorities
        type: array
        items:
          type: string
          enum: ['ROLE_ADMINISTRATOR', 'ROLE_SERVICE_MANAGER', 'ROLE_CUSTOMER_SUPPORT_AGENT', 'ROLE_CHATBOT_TRAINER', 'ROLE_ANALYST', 'ROLE_UNAUTHENTICATED']
        description: "List of user authorities"
*/
-- TODO: Verify if this is correct
SELECT
    login,
    first_name,
    last_name,
    id_code,
    display_name,
    authority_name AS authorities
FROM denorm_user_csa_authority_profile_settings
WHERE
    login = :login
  AND password_hash = :password
  AND array_length(authority_name, 1) > 0
LIMIT 1;
