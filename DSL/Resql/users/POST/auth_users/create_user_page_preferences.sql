/*
declaration:
  version: 0.1
  description: "Insert a user page preference with selected columns and creation timestamp"
  method: post
  accepts: json
  returns: json
  namespace: auth_users
  allowlist:
    body:
      - field: user_id
        type: string
        description: "Unique identifier of the user"
      - field: page_name
        type: string
        description: "Name of the page"
      - field: page_results
        type: string
        description: "Serialized results or settings for the page"
      - field: selected_columns
        type: array
        items:
          type: string
        description: "List of selected columns"
*/
INSERT INTO user_page_preferences (user_id, page_name, page_results, selected_columns)
VALUES (:user_id, :page_name, :page_results, :selected_columns::TEXT[]);