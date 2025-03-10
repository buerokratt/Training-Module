WITH MaxChatHistoryComments AS (
    SELECT MAX(id) AS maxId
    FROM chat_history_comments
    GROUP BY chat_id
),
     ChatUser AS (
         SELECT DISTINCT ON (id_code)
             id_code,
             display_name,
             first_name,
             last_name
         FROM "user"
         ORDER BY id_code, id DESC
     ),
     ChatHistoryComments AS (
         SELECT 
             comment, 
             chat_id, 
             created, 
             author_display_name
         FROM chat_history_comments
         JOIN MaxChatHistoryComments ON id = maxId
     ),
     MessageWithContent AS (
         SELECT
             MAX(id) AS maxId,
             MIN(id) AS minId
         FROM message
         WHERE content <> ''
           AND content <> 'message-read'
         GROUP BY chat_base_id
     ),
     FirstContentMessage AS (
         SELECT created, chat_base_id
         FROM message
                  JOIN MessageWithContent ON message.id = MessageWithContent.minId
     ),
     LastContentMessage AS (
         SELECT content, chat_base_id
         FROM message
                  JOIN MessageWithContent ON message.id = MessageWithContent.maxId
     ),
     TitleVisibility AS (
         SELECT value
         FROM configuration
         WHERE key = 'is_csa_title_visible'
    AND NOT deleted
ORDER BY id DESC
    LIMIT 1
    ),
    FulfilledMessages AS (
SELECT MAX(id) AS maxId
FROM message
WHERE event = 'contact-information-fulfilled'
GROUP BY chat_base_id
    ),
    ContactsMessage AS (
SELECT chat_base_id, content
FROM message
    JOIN FulfilledMessages ON id = maxId
    ),
    MaxMessages AS (
SELECT MAX(id) AS maxId
FROM message
GROUP BY chat_base_id
    ),
    Messages AS (
SELECT event, updated, chat_base_id, author_id
FROM message
    JOIN MaxMessages ON id = maxID
    ),
    MaxChats AS (
SELECT MAX(id) AS maxId
FROM chat
WHERE ended IS NOT NULL
  AND status <> 'IDLE'
  AND ended::date BETWEEN :start::date AND :end::date
GROUP BY base_id
    ),
    EndedChatMessages AS (
SELECT
    base_id,
    customer_support_id,
    customer_support_display_name,
    csa_title,
    end_user_id,
    end_user_first_name,
    end_user_last_name,
    end_user_email,
    end_user_phone,
    end_user_os,
    end_user_url,
    status,
    updated,
    ended,
    forwarded_to_name,
    received_from,
    labels,
    created,
    feedback_text,
    feedback_rating
FROM chat
    RIGHT JOIN MaxChats ON id = maxId
    ),
    RatedChats AS (
SELECT MAX(feedback_rating) AS rating
FROM chat
WHERE feedback_rating IS NOT NULL
GROUP BY base_id
    ),
    RatedChatsCount AS (
SELECT COUNT(rating) AS total FROM RatedChats
    ),
    Promoters AS (
SELECT COUNT(rating) AS p FROM RatedChats WHERE rating >= 9
    ),
    Detractors AS (
SELECT COUNT(rating) AS d FROM RatedChats WHERE rating <= 6
    ),
    NPS AS (
SELECT ROUND(((p / (GREATEST(total, 1) * 1.0)) - (d / (GREATEST(total, 1) * 1.0))) * 100.0, 2) AS nps
FROM RatedChatsCount
    CROSS JOIN Promoters
    CROSS JOIN Detractors
    )
SELECT c.base_id AS id,
       c.customer_support_id,
       c.customer_support_display_name,
       (CASE WHEN TitleVisibility.value = 'true' THEN c.csa_title ELSE '' END) AS csa_title,
       c.end_user_id,
       c.end_user_first_name,
       c.end_user_last_name,
       c.end_user_email,
       c.end_user_phone,
       c.end_user_os,
       c.end_user_url,
       c.status,
       FirstContentMessage.created,
       c.updated,
       c.ended,
       c.forwarded_to_name,
       c.received_from,
       c.labels,
       s.comment,
       s.created as comment_added_date,
       s.author_display_name as comment_author,
       mu.display_name AS user_display_name,
       cu.first_name AS customer_support_first_name,
       cu.last_name AS customer_support_last_name,
       LastContentMessage.content AS last_message,
       (CASE WHEN m.event = '' THEN NULL ELSE LOWER(m.event) END) AS last_message_event,
       ContactsMessage.content AS contacts_message,
       m.updated AS last_message_timestamp,
       c.feedback_text,
       c.feedback_rating,
       nps,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM EndedChatMessages AS c
         JOIN Messages AS m ON c.base_id = m.chat_base_id
         LEFT JOIN ChatHistoryComments AS s ON s.chat_id =  m.chat_base_id
         LEFT JOIN ChatUser AS mu ON mu.id_code = m.author_id
         LEFT JOIN ChatUser AS cu ON cu.id_code = c.customer_support_id
         JOIN LastContentMessage ON c.base_id = LastContentMessage.chat_base_id
         JOIN FirstContentMessage ON c.base_id = FirstContentMessage.chat_base_id
         LEFT JOIN ContactsMessage ON ContactsMessage.chat_base_id = c.base_id
         CROSS JOIN TitleVisibility
         CROSS JOIN NPS
WHERE (
    (
        LENGTH(:customerSupportIds) = 0 OR
        c.customer_support_id = ANY(string_to_array(:customerSupportIds, ','))
    ) AND (
          :search IS NULL OR
          :search = '' OR
          LOWER(c.customer_support_display_name) LIKE LOWER('%' || :search || '%') OR
          LOWER(c.end_user_first_name) LIKE LOWER('%' || :search || '%') OR
          LOWER(ContactsMessage.content) LIKE LOWER('%' || :search || '%') OR
          LOWER(s.comment) LIKE LOWER('%' || :search || '%') OR
          LOWER(c.status) LIKE LOWER('%' || :search || '%') OR
          LOWER(m.event) LIKE LOWER('%' || :search || '%') OR
          LOWER(c.base_id) LIKE LOWER('%' || :search || '%') OR
          TO_CHAR(FirstContentMessage.created, 'DD.MM.YYYY HH24:MI:SS') LIKE '%' || :search || '%' OR
          TO_CHAR(c.ended, 'DD.MM.YYYY HH24:MI:SS') LIKE '%' || :search || '%' OR
          EXISTS (
              SELECT 1
              FROM message AS msg
              WHERE msg.chat_base_id = c.base_id
                AND LOWER(msg.content) LIKE LOWER('%' || :search || '%')
          )
          )
    )
ORDER BY
    CASE WHEN :sorting = 'created asc' THEN FirstContentMessage.created END ASC,
    CASE WHEN :sorting = 'created desc' THEN FirstContentMessage.created END DESC,
    CASE WHEN :sorting = 'ended asc' THEN c.ended END ASC,
    CASE WHEN :sorting = 'ended desc' THEN c.ended END DESC,
    CASE WHEN :sorting = 'customerSupportDisplayName asc' THEN c.customer_support_display_name END ASC,
    CASE WHEN :sorting = 'customerSupportDisplayName desc' THEN c.customer_support_display_name END DESC,
    CASE WHEN :sorting = 'endUserName asc' THEN c.end_user_first_name END ASC,
    CASE WHEN :sorting = 'endUserName desc' THEN c.end_user_first_name END DESC,
    CASE WHEN :sorting = 'endUserId asc' THEN c.end_user_id END ASC,
    CASE WHEN :sorting = 'endUserId desc' THEN c.end_user_id END desc,
    CASE WHEN :sorting = 'contactsMessage asc' THEN ContactsMessage.content END ASC,
    CASE WHEN :sorting = 'contactsMessage desc' THEN ContactsMessage.content END DESC,
    CASE WHEN :sorting = 'comment asc' THEN s.comment END ASC,
    CASE WHEN :sorting = 'comment desc' THEN s.comment END DESC,
    CASE WHEN :sorting = 'labels asc' THEN c.labels END ASC,
    CASE WHEN :sorting = 'labels desc' THEN c.labels END DESC,
    CASE
        WHEN :sorting = 'status asc' THEN
            CASE
                WHEN m.event IS NULL OR m.event = '' THEN NULL
                ELSE m.event
                END
        END ASC NULLS LAST,
    CASE
        WHEN :sorting = 'status desc' THEN
            CASE
                WHEN m.event IS NULL OR m.event = '' THEN NULL
                ELSE m.event
                END
        END DESC NULLS LAST,
    CASE WHEN :sorting = 'feedbackRating desc' THEN c.feedback_rating END DESC NULLS LAST,
    CASE WHEN :sorting = 'feedbackRating asc' THEN c.feedback_rating END ASC,
    CASE WHEN :sorting = 'customerSupportFullName desc' THEN (cu.first_name || ' ' || cu.last_name) END DESC NULLS LAST,
    CASE WHEN :sorting = 'customerSupportFullName asc' THEN (cu.first_name || ' ' || cu.last_name) END ASC NULLS LAST,
    CASE WHEN :sorting = 'id asc' THEN c.base_id END ASC,
    CASE WHEN :sorting = 'id desc' THEN c.base_id END DESC
OFFSET ((GREATEST(:page, 1) - 1) * :page_size) LIMIT :page_size;
