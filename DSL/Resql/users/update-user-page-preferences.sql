INSERT INTO user_page_preferences (user_id, page_name, page_results, selected_columns, created)
VALUES (:user_id, :page_name, :page_results, :selected_columns::TEXT[], :created::timestamp with time zone);