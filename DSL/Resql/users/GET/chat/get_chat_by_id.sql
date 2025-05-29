/*
declaration:
  version: 0.1
  description: "Fetch full details of a chat by its ID, including metadata and conditional CSA title"
  method: get
  namespace: chat
  returns: json
  allowlist:
    query:
      - field: id
        type: string
        description: "Unique identifier of the chat"
      - field: is_csa_title_visible
        type: string
        enum: ['true', 'false']
        description: "Controls whether CSA title is included in the response"
  response:
    fields:
      - field: id
        type: string
        description: "Unique chat identifier"
      - field: customer_support_id
        type: string
        description: "ID of the customer support agent"
      - field: customer_support_display_name
        type: string
        description: "Display name of the customer support agent"
      - field: end_user_id
        type: string
        description: "ID of the end user"
      - field: end_user_first_name
        type: string
        description: "First name of the end user"
      - field: end_user_last_name
        type: string
        description: "Last name of the end user"
      - field: status
        type: string
        enum: ['ENDED', 'OPEN', 'REDIRECTED', 'IDLE', 'VALIDATING']
        description: "Current status of the chat"
      - field: feedback_text
        type: string
        description: "Feedback comment left by the user"
      - field: feedback_rating
        type: integer
        description: "Rating given by the user"
      - field: end_user_email
        type: string
        description: "Email address of the end user"
      - field: end_user_phone
        type: string
        description: "Phone number of the end user"
      - field: end_user_os
        type: string
        description: "Operating system used by the end user"
      - field: end_user_url
        type: string
        description: "Referring URL of the end user"
      - field: created
        type: timestamp
        description: "Timestamp when the chat was created"
      - field: updated
        type: timestamp
        description: "Timestamp when the chat was last updated"
      - field: ended
        type: timestamp
        description: "Timestamp when the chat ended"
      - field: external_id
        type: string
        description: "External identifier for the chat"
      - field: received_from
        type: string
        description: "Source system the chat was received from"
      - field: received_from_name
        type: string
        description: "Display name of the chat source"
      - field: forwarded_to_name
        type: string
        description: "Display name of the recipient the chat was forwarded to"
      - field: forwarded_to
        type: string
        description: "ID of the recipient the chat was forwarded to"
      - field: csa_title
        type: string
        description: "CSA title, conditionally returned if is_csa_title_visible is true"
      - field: last_message_including_empty_content
        type: string
        description: "Content of the last message including empty messages"
      - field: last_message_timestamp
        type: timestamp
        description: "Timestamp of the last message"
*/
SELECT
    c.chat_id AS id,
    c.customer_support_id,
    c.customer_support_display_name,
    c.end_user_id,
    c.end_user_first_name,
    c.end_user_last_name,
    c.status,
    c.feedback_text,
    c.feedback_rating,
    c.end_user_email,
    c.end_user_phone,
    c.end_user_os,
    c.end_user_url,
    c.created,
    c.updated,
    c.ended,
    c.external_id,
    c.received_from,
    c.received_from_name,
    c.forwarded_to_name,
    c.forwarded_to,
    c.last_message_including_empty_content,
    c.last_message_timestamp,
    CASE
        WHEN :is_csa_title_visible = 'true' THEN c.csa_title
        ELSE ''
    END AS csa_title
FROM denormalized_chat c
WHERE chat_id = :id
ORDER BY denormalized_record_created DESC
LIMIT 1;
