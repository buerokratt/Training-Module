/*
declaration:
  version: 0.1
  description: "Fetch the latest page preferences for a user by page name, including selected columns"
  method: get
  namespace: auth_users
  returns: json
  allowlist:
    query:
      - field: user_id
        type: string
        description: "Unique identifier for the user"
      - field: page_name
        type: string
        description: "Name of the page to retrieve preferences for"
  response:
    fields:
      - field: id
        type: string
        description: "Primary key of the preference entry"
      - field: user_id
        type: string
        description: "User's unique identifier"
      - field: page_name
        type: string
        description: "Name of the page"
      - field: page_results
        type: integer
        description: "number of page"
      - field: created
        type: timestamp
        description: "Timestamp when the preference entry was created"
      - field: selected_columns
        type: array
        items:
          type: string
        description: "Comma-separated list of selected columns"
*/
SELECT id, selected_columns, created, page_results, page_name, user_id  FROM user_page_preferences
WHERE user_id = :user_id
  AND page_name = :page_name
ORDER BY created DESC LIMIT 1;