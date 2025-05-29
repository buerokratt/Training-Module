SELECT id, selected_columns, created, page_results, page_name, user_id  FROM user_page_preferences
WHERE user_id = :user_id
  AND page_name = :page_name
ORDER BY created DESC LIMIT 1;