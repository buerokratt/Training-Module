/*
declaration:
  version: 0.1
  description: "Fetch paginated, filtered, and sorted list of archived chat records with detailed metadata"
  method: get
  namespace: chat
  returns: json
  allowlist:
    query:
      - field: page
        type: integer
        description: "Page number starting from 1"
      - field: page_size
        type: integer
        description: "Number of results per page"
      - field: sorting
        type: string
        enum: ['created asc', 'created desc', 'ended asc', 'ended desc', 'customerSupportDisplayName asc', 'customerSupportDisplayName desc', 'endUserName asc', 'endUserName desc', 'endUserEmail asc', 'endUserEmail desc', 'endUserId asc', 'endUserId desc', 'contactsMessage asc', 'contactsMessage desc', 'comment asc', 'comment desc', 'labels asc', 'labels desc', 'status asc', 'status desc', 'feedbackRating asc', 'feedbackRating desc', 'customerSupportFullName asc', 'customerSupportFullName desc', 'id asc', 'id desc']
        description: "Sort order for result set"
      - field: is_csa_title_visible
        type: string
        enum: ['true', 'false']
        description: "Controls visibility of CSA title in response"
      - field: customerSupportIds
        type: string
        description: "Comma-separated list of customer support IDs to filter by (array format)"
      - field: search
        type: string
        description: "Search term to match against multiple fields including messages"
      - field: start
        type: string
        description: "Start date in YYYY-MM-DD format for filtering ended chats"
      - field: end
        type: string
        description: "End date in YYYY-MM-DD format for filtering ended chats"
  response:
    fields:
      - field: id
        type: string
        description: "Chat ID"
      - field: customer_support_id
        type: string
        description: "Customer support agent's ID"
      - field: customer_support_display_name
        type: string
        description: "Display name of the customer support agent"
      - field: end_user_id
        type: string
        description: "End user's ID"
      - field: end_user_first_name
        type: string
        description: "First name of the end user"
      - field: end_user_last_name
        type: string
        description: "Last name of the end user"
      - field: end_user_email
        type: string
        description: "End user's email address"
      - field: end_user_phone
        type: string
        description: "End user's phone number"
      - field: end_user_os
        type: string
        description: "Operating system used by the end user"
      - field: end_user_url
        type: string
        description: "URL used by the end user"
      - field: status
        type: string
        enum: ['ENDED', 'OPEN', 'REDIRECTED', 'IDLE', 'VALIDATING']
        description: "Chat status"
      - field: created
        type: timestamp
        description: "Timestamp of the first message in the chat"
      - field: last_message_author_id
        type: string
        description: "Author ID of the last message"
      - field: updated
        type: timestamp
        description: "Timestamp when the chat was last updated"
      - field: ended
        type: timestamp
        description: "Timestamp when the chat ended"
      - field: forwarded_to_name
        type: string
        description: "Name of the person the chat was forwarded to"
      - field: received_from
        type: string
        description: "Source the chat was received from"
      - field: labels
        type: string
        description: "Comma-separated list of chat labels"
      - field: comment
        type: string
        description: "Internal comment on the chat"
      - field: comment_added_date
        type: timestamp
        description: "Timestamp when the comment was added"
      - field: comment_author
        type: string
        description: "Author of the comment"
      - field: customer_support_first_name
        type: string
        description: "First name of the customer support agent"
      - field: customer_support_last_name
        type: string
        description: "Last name of the customer support agent"
      - field: last_message
        type: string
        description: "Last message content"
      - field: contacts_message
        type: string
        description: "Contact message content"
      - field: last_message_timestamp
        type: timestamp
        description: "Timestamp of the last message"
      - field: feedback_text
        type: string
        description: "User feedback text"
      - field: feedback_rating
        type: integer
        description: "User feedback rating"
      - field: csa_title
        type: string
        description: "CSA title (conditionally visible)"
      - field: last_message_event
        type: string
        enum: ['', 'inactive-chat-ended', 'taken-over', 'unavailable_organization_ask_contacts', 'answered', 'terminated', 'chat_sent_to_csa_email', 'client-left', 'client_left_with_accepted', 'client_left_with_no_resolution', 'client_left_for_unknown_reasons', 'accepted', 'hate_speech', 'other', 'response_sent_to_client_email', 'greeting', 'requested-authentication', 'authentication_successful', 'authentication_failed', 'ask-permission', 'ask-permission-accepted', 'ask-permission-rejected', 'ask-permission-ignored', 'ask_to_forward_to_csa', 'forwarded_to_backoffice', 'continue_chatting_with_bot', 'rating', 'redirected', 'contact-information', 'contact-information-rejected', 'contact-information-fulfilled', 'unavailable-contact-information-fulfilled', 'contact-information-skipped', 'requested-chat-forward', 'requested-chat-forward-accepted', 'requested-chat-forward-rejected', 'unavailable_organization', 'unavailable_csas', 'unavailable_csas_ask_contacts', 'unavailable_holiday', 'pending-assigned', 'user-reached', 'user-not-reached', 'user-authenticated', 'message-read', 'waiting_validation', 'approved_validation']
        description: "Event type associated with the last message"
      - field: total_pages
        type: integer
        description: "Total number of result pages"
*/
WITH
    latest_chat_records AS (
        SELECT DISTINCT ON (chat_id)
            chat_id,
            customer_support_id,
            customer_support_display_name,
            end_user_id,
            end_user_first_name,
            end_user_last_name,
            end_user_email,
            end_user_phone,
            end_user_os,
            end_user_url,
            status,
            first_message_timestamp,
            last_message_author_id,
            updated,
            ended,
            forwarded_to_name,
            received_from,
            labels,
            comment,
            comment_added_date,
            comment_author,
            customer_support_first_name,
            customer_support_last_name,
            first_message,
            last_message,
            contacts_message,
            last_message_timestamp,
            feedback_text,
            feedback_rating,
            CASE
                WHEN :is_csa_title_visible = 'true' THEN csa_title
                ELSE ''
            END AS csa_title,
            last_message_event,
            all_messages
        FROM chat.denormalized_chat
        ORDER BY chat_id ASC, id DESC
    )

SELECT
    latest_chat_records.chat_id AS id,
    latest_chat_records.customer_support_id,
    latest_chat_records.customer_support_display_name,
    latest_chat_records.end_user_id,
    latest_chat_records.end_user_first_name,
    latest_chat_records.end_user_last_name,
    latest_chat_records.end_user_email,
    latest_chat_records.end_user_phone,
    latest_chat_records.end_user_os,
    latest_chat_records.end_user_url,
    latest_chat_records.status,
    latest_chat_records.first_message_timestamp AS created,
    latest_chat_records.last_message_author_id,
    latest_chat_records.updated,
    latest_chat_records.ended,
    latest_chat_records.forwarded_to_name,
    latest_chat_records.received_from,
    latest_chat_records.labels,
    latest_chat_records.comment,
    latest_chat_records.comment_added_date,
    latest_chat_records.comment_author,
    latest_chat_records.customer_support_first_name,
    latest_chat_records.customer_support_last_name,
    latest_chat_records.last_message,
    latest_chat_records.contacts_message,
    latest_chat_records.last_message_timestamp,
    latest_chat_records.feedback_text,
    latest_chat_records.feedback_rating,
    latest_chat_records.csa_title,
    latest_chat_records.last_message_event,
    CEIL(COUNT(*) OVER () / latest_chat_records.:page_size::DECIMAL) AS total_pages
FROM latest_chat_records
WHERE
    (
        latest_chat_records.ended IS NOT NULL
        AND latest_chat_records.status <> 'IDLE'
        AND ended::date BETWEEN :start::date AND :end::date
        AND latest_chat_records.first_message <> ''
        AND latest_chat_records.first_message <> 'message-read'
        AND latest_chat_records.last_message <> ''
        AND latest_chat_records.last_message <> 'message-read'
    )
    AND (
        LENGTH(latest_chat_records.:customerSupportIds) = 0
        OR latest_chat_records.customer_support_id
        = ANY(STRING_TO_ARRAY(latest_chat_records.:customerSupportIds, ','))
    )
    AND (
        :search IS NULL
        OR :search = ''
        OR LOWER(latest_chat_records.customer_support_display_name) LIKE LOWER(
            '%' || :search || '%'
        )
        OR LOWER(latest_chat_records.end_user_first_name) LIKE LOWER(
            '%' || :search || '%'
        )
        OR LOWER(latest_chat_records.contacts_message) LIKE LOWER(
            '%' || :search || '%'
        )
        OR LOWER(latest_chat_records.comment) LIKE LOWER(
            '%' || :search || '%'
        )
        OR LOWER(latest_chat_records.status) LIKE LOWER(
            '%' || :search || '%'
        )
        OR LOWER(latest_chat_records.last_message_event) LIKE LOWER(
            '%' || :search || '%'
        )
        OR LOWER(latest_chat_records.chat_id) LIKE LOWER(
            '%' || :search || '%'
        )
        OR TO_CHAR(
            latest_chat_records.first_message_timestamp, 'DD.MM.YYYY HH24:MI:SS'
        ) LIKE LOWER(
            '%' || :search || '%'
        )
        OR TO_CHAR(latest_chat_records.ended, 'DD.MM.YYYY HH24:MI:SS') LIKE LOWER(
            '%' || :search || '%'
        )
        OR LOWER(latest_chat_records.last_message) LIKE LOWER(
            '%' || :search || '%'
        )
        OR EXISTS (
            SELECT 1
            FROM UNNEST(all_messages) AS message_content
            WHERE LOWER(message_content) LIKE LOWER('%' || :search || '%')
        )
    )
ORDER BY
    CASE
        WHEN
                        :sorting = 'created asc'
            THEN latest_chat_records.first_message_timestamp
    END ASC,
    CASE
        WHEN
                        :sorting = 'created desc'
            THEN latest_chat_records.first_message_timestamp
    END DESC,
    CASE
        WHEN latest_chat_records.:sorting = 'ended asc' THEN latest_chat_records.ended
    END ASC,
    CASE
        WHEN latest_chat_records.:sorting = 'ended desc' THEN latest_chat_records.ended
    END DESC,
    CASE
        WHEN
                        :sorting = 'customerSupportDisplayName asc'
            THEN latest_chat_records.customer_support_display_name
    END ASC,
    CASE
        WHEN
                        :sorting = 'customerSupportDisplayName desc'
            THEN latest_chat_records.customer_support_display_name
    END DESC,
    CASE
        WHEN
                        :sorting = 'endUserName asc'
            THEN latest_chat_records.end_user_first_name
    END ASC,
    CASE
        WHEN
                        :sorting = 'endUserName desc'
            THEN latest_chat_records.end_user_first_name
    END DESC,
    CASE
        WHEN latest_chat_records.:sorting = 'endUserEmail asc' THEN c.end_user_email
    END ASC,
    CASE
        WHEN latest_chat_records.:sorting = 'endUserEmail desc' THEN c.end_user_email
    END DESC,
    CASE
        WHEN
                        :sorting = 'endUserId asc'
            THEN latest_chat_records.end_user_id
    END ASC,
    CASE
        WHEN
                        :sorting = 'endUserId desc'
            THEN latest_chat_records.end_user_id
    END DESC,
    CASE
        WHEN
                        :sorting = 'contactsMessage asc'
            THEN latest_chat_records.contacts_message
    END ASC,
    CASE
        WHEN
                        :sorting = 'contactsMessage desc'
            THEN latest_chat_records.contacts_message
    END DESC,
    CASE
        WHEN
                        :sorting = 'comment asc'
            THEN latest_chat_records.comment
    END ASC,
    CASE
        WHEN
                        :sorting = 'comment desc'
            THEN latest_chat_records.comment
    END DESC,
    CASE
        WHEN latest_chat_records.:sorting = 'labels asc' THEN latest_chat_records.labels
    END ASC,
    CASE
        WHEN
                        :sorting = 'labels desc'
            THEN latest_chat_records.labels
    END DESC,
    CASE
        WHEN latest_chat_records.:sorting = 'status asc' THEN
            CASE
                WHEN
                    latest_chat_records.last_message_event IS NULL
                    OR latest_chat_records.last_message_event = ''
                    THEN NULL
                ELSE latest_chat_records.last_message_event
            END
    END ASC NULLS LAST,
    CASE
        WHEN latest_chat_records.:sorting = 'status desc' THEN
            CASE
                WHEN
                    latest_chat_records.last_message_event IS NULL
                    OR latest_chat_records.last_message_event = ''
                    THEN NULL
                ELSE latest_chat_records.last_message_event
            END
    END DESC NULLS LAST,
    CASE
        WHEN
                        :sorting = 'feedbackRating desc'
            THEN latest_chat_records.feedback_rating
    END DESC NULLS LAST,
    CASE
        WHEN
                        :sorting = 'feedbackRating asc'
            THEN latest_chat_records.feedback_rating
    END ASC,
    CASE
        WHEN latest_chat_records.:sorting = 'customerSupportFullName desc' THEN
            (
                latest_chat_records.customer_support_first_name
                || ' '
                || latest_chat_records.customer_support_last_name
            )
    END DESC NULLS LAST,
    CASE
        WHEN latest_chat_records.:sorting = 'customerSupportFullName asc' THEN
            (
                latest_chat_records.customer_support_first_name
                || ' '
                || latest_chat_records.customer_support_last_name
            )
    END ASC NULLS LAST,
    CASE
        WHEN latest_chat_records.:sorting = 'id asc' THEN latest_chat_records.chat_id
    END ASC,
    CASE
        WHEN latest_chat_records.:sorting = 'id desc' THEN latest_chat_records.chat_id
    END DESC
LIMIT :page_size::INTEGER OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER);
