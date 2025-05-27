/*
declaration:
  version: 0.1
  description: "Fetch the latest version of each message in a chat by chat ID"
  method: get
  namespace: chat
  returns: json
  allowlist:
    query:
      - field: chatId
        type: string
        description: "Unique identifier of the chat to fetch messages for"
  response:
    fields:
      - field: id
        type: string
        description: "Unique identifier of the message version"
      - field: chat_id
        type: string
        description: "Chat ID the message belongs to"
      - field: content
        type: string
        description: "Text content of the message"
      - field: buttons
        type: string
        description: "Serialized buttons or UI elements"
      - field: event
        type: string
        enum: ['', 'inactive-chat-ended', 'taken-over', 'unavailable_organization_ask_contacts', 'answered', 'terminated', 'chat_sent_to_csa_email', 'client-left', 'client_left_with_accepted', 'client_left_with_no_resolution', 'client_left_for_unknown_reasons', 'accepted', 'hate_speech', 'other', 'response_sent_to_client_email', 'greeting', 'requested-authentication', 'authentication_successful', 'authentication_failed', 'ask-permission', 'ask-permission-accepted', 'ask-permission-rejected', 'ask-permission-ignored', 'ask_to_forward_to_csa', 'forwarded_to_backoffice', 'continue_chatting_with_bot', 'rating', 'redirected', 'contact-information', 'contact-information-rejected', 'contact-information-fulfilled', 'unavailable-contact-information-fulfilled', 'contact-information-skipped', 'requested-chat-forward', 'requested-chat-forward-accepted', 'requested-chat-forward-rejected', 'unavailable_organization', 'unavailable_csas', 'unavailable_csas_ask_contacts', 'unavailable_holiday', 'pending-assigned', 'user-reached', 'user-not-reached', 'user-authenticated', 'message-read', 'waiting_validation', 'approved_validation']
        description: "System event associated with the message"
      - field: author_id
        type: string
        description: "ID of the message author"
      - field: author_timestamp
        type: timestamp
        description: "Timestamp from the author's perspective"
      - field: author_first_name
        type: string
        description: "First name of the author"
      - field: author_last_name
        type: string
        description: "Last name of the author"
      - field: author_role
        type: string
        description: "Role of the message author (e.g. end_user, support_agent)"
      - field: forwarded_by_user
        type: string
        description: "User ID who forwarded the message"
      - field: forwarded_from_csa
        type: string
        description: "CSA ID the message was forwarded from"
      - field: forwarded_to_csa
        type: string
        description: "CSA ID the message was forwarded to"
      - field: rating
        type: integer
        description: "User-provided rating associated with the message"
      - field: created
        type: timestamp
        description: "Creation timestamp of the message version"
      - field: updated
        type: timestamp
        description: "Last update timestamp of the message version"
*/
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
WHERE id IN (SELECT max(id) FROM message WHERE chat_base_id = :chatId GROUP BY base_id)
ORDER BY created ASC;
