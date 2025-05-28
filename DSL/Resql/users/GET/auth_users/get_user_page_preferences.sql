SELECT id, user_id, page_name, page_results, created
FROM auth_users.user_page_preferences
WHERE user_id = :user_id
  AND page_name = :page_name
ORDER BY created DESC LIMIT 1;