SELECT
    login,
    first_name,
    last_name,
    id_code,
    display_name,
    authority_name AS authorities
FROM denormalized_user_data d1
WHERE
    login = :login
    AND password_hash = :password
    AND array_length(authority_name, 1) > 0
    AND created = (
        SELECT max(created)
        FROM denormalized_user_data d2
        WHERE d2.user_id = d1.user_id
    )
LIMIT 1;