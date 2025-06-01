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
SELECT
    login,
    first_name,
    last_name,
    id_code,
    display_name,
    authority_name AS authorities
FROM auth_users.denormalized_user_data AS d_1
WHERE
    id_code = :login
    AND password_hash = :password
    AND ARRAY_LENGTH(authority_name, 1) > 0
    AND created = (
        SELECT MAX(d_2.created)
        FROM auth_users.denormalized_user_data AS d_2
        WHERE d_2.id_code = d_1.id_code
    )
LIMIT 1;
