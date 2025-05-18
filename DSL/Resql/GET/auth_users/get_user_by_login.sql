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
