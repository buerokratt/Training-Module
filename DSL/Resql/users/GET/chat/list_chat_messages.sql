SELECT m.base_id      AS id,
       m.chat_base_id AS chat_id,
       m.content,
       m.buttons,
       m.event,
       m.author_id,
       m.author_timestamp,
       m.author_first_name,
       m.author_last_name,
       m.author_role,
       m.forwarded_by_user,
       m.forwarded_from_csa,
       m.forwarded_to_csa,
       rating,
       created,
       updated
FROM message m
WHERE updated = (SELECT max(m2.updated) FROM message AS m2 WHERE m2.base_id = m.base_id AND m2.chat_base_id = :chatId)
ORDER BY created ASC;
