/*
declaration:
  version: 0.1
  description: "Fetch paginated, searchable, and filtered list of active CSA users with profile and authority data"
  method: get
  namespace: auth_users
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
        enum: ['name asc', 'name desc', 'idCode asc', 'idCode desc', 'Role asc', 'Role desc', 'displayName asc', 'displayName desc', 'csaTitle asc', 'csaTitle desc', 'csaEmail asc', 'csaEmail desc', 'department asc', 'department desc', 'customerSupportStatus asc', 'customerSupportStatus desc']
        description: "Sort order for results"
      - field: roles
        type: string
        description: "Comma-separated list of roles to filter by (array format)"
      - field: is_csa_title_visible
        type: string
        enum: ['true', 'false']
        description: "Controls whether CSA title is included in response"
      - field: search_display_name_and_csa_title
        type: string
        description: "Search filter for display name or CSA title"
      - field: search_full_name_and_csa_title
        type: string
        description: "Search filter for full name or CSA title"
      - field: show_active_only
        type: boolean
        description: "Filter out offline users if true"
      - field: search_full_name
        type: string
        description: "Search filter for full name"
      - field: search_id_code
        type: string
        description: "Search filter for user ID code"
      - field: search_display_name
        type: string
        description: "Search filter for display name"
      - field: search_csa_title
        type: string
        description: "Search filter for CSA title"
      - field: search_csa_email
        type: string
        description: "Search filter for CSA email"
      - field: search_authority
        type: string
        description: "Search filter for authority name"
      - field: search_department
        type: string
        description: "Search filter for department"
      - field: excluded_users
        type: string
        description: "Comma-separated list of user ID codes to exclude (array format)"
  response:
    fields:
      - field: login
        type: string
        description: "User login name"
      - field: first_name
        type: string
        description: "User's first name"
      - field: last_name
        type: string
        description: "User's last name"
      - field: id_code
        type: string
        description: "Unique identifier for the user"
      - field: display_name
        type: string
        description: "Full display name"
      - field: csa_title
        type: string
        description: "CSA title, conditionally included"
      - field: csa_email
        type: string
        description: "CSA email address"
      - field: department
        type: string
        description: "User department"
      - field: authorities
        type: []
        items:
          type: string
          enum: ['ROLE_ADMINISTRATOR', 'ROLE_SERVICE_MANAGER', 'ROLE_CUSTOMER_SUPPORT_AGENT', 'ROLE_CHATBOT_TRAINER', 'ROLE_ANALYST', 'ROLE_UNAUTHENTICATED']
        description: "List of user authorities"
      - field: customer_support_status
        type: string
        enum: ['online', 'idle', 'offline']
        description: "Current support status of the user"
      - field: status_comment
        type: string
        description: "Comment on user's status"
      - field: status_comment_time_stamp
        type: timestamp
        description: "Timestamp of the status comment"
      - field: total_pages
        type: integer
        description: "Total number of result pages based on filters and page size"
*/
SELECT
    login,
    first_name,
    last_name,
    id_code,
    display_name,
    CASE
        WHEN :is_csa_title_visible = 'true' THEN csa_title
        ELSE ''
    END AS csa_title,
    csa_email,
    department,
    authority_name AS authorities,
    status AS customer_support_status,
    status_comment,
    csa_created AS status_comment_time_stamp,
    CEIL(COUNT(*) OVER () / :page_size::DECIMAL) AS total_pages
FROM denormalized_user_data AS d_1
WHERE
    user_status <> 'deleted'
    AND ARRAY_LENGTH(authority_name, 1) > 0
    AND created = (
        SELECT MAX(d_2.created)
        FROM denormalized_user_data AS d_2
        WHERE d_1.id_code = d_2.id_code
    )
    AND (authority_name)::TEXT[] && 
        (SELECT array_agg(trim(e)) FROM 
            unnest(string_to_array(
            btrim(:roles, '[]'), 
            ','
            )) AS e)::TEXT ARRAY
    AND (
        :search_display_name_and_csa_title IS NULL
        OR display_name ILIKE '%' || :search_display_name_and_csa_title || '%'
        OR csa_title ILIKE '%' || :search_display_name_and_csa_title || '%'
    )
    AND (
        :search_full_name_and_csa_title IS NULL
        OR (first_name || ' ' || last_name) ILIKE '%' || :search_full_name_and_csa_title || '%'
        OR csa_title ILIKE '%' || :search_full_name_and_csa_title || '%'
    )
    AND ((:show_active_only)::boolean <> TRUE OR status <> 'offline')
    AND (:search_full_name IS NULL OR (
        (first_name || ' ' || last_name) ILIKE '%' || :search_full_name || '%'
    ))
    AND (:search_id_code IS NULL OR id_code ILIKE '%' || :search_id_code || '%')
    AND (
        :search_display_name IS NULL
        OR display_name ILIKE '%' || :search_display_name || '%'
    )
    AND (:search_csa_title IS NULL OR csa_title ILIKE '%' || :search_csa_title || '%')
    AND (:search_csa_email IS NULL OR csa_email ILIKE '%' || :search_csa_email || '%')
    AND (:search_authority IS NULL OR EXISTS (
        SELECT 1
        FROM UNNEST(authority_name) AS authority
        WHERE authority::TEXT ILIKE '%' || :search_authority || '%'
    ))
    AND (
        :search_department IS NULL
        OR department ILIKE '%' || :search_department || '%'
    )
    AND id_code NOT IN (:excluded_users)
ORDER BY
    CASE WHEN :sorting = 'name asc' THEN first_name END ASC,
    CASE WHEN :sorting = 'name desc' THEN first_name END DESC,
    CASE WHEN :sorting = 'idCode asc' THEN id_code END ASC,
    CASE WHEN :sorting = 'idCode desc' THEN id_code END DESC,
    CASE WHEN :sorting = 'Role asc' THEN authority_name END ASC,
    CASE WHEN :sorting = 'Role desc' THEN authority_name END DESC,
    CASE WHEN :sorting = 'displayName asc' THEN display_name END ASC,
    CASE WHEN :sorting = 'displayName desc' THEN display_name END DESC,
    CASE WHEN :sorting = 'csaTitle asc' THEN csa_title END ASC,
    CASE WHEN :sorting = 'csaTitle desc' THEN csa_title END DESC,
    CASE WHEN :sorting = 'csaEmail asc' THEN csa_email END ASC,
    CASE WHEN :sorting = 'csaEmail desc' THEN csa_email END DESC,
    CASE WHEN :sorting = 'department asc' THEN department END ASC,
    CASE WHEN :sorting = 'department desc' THEN department END DESC,
    CASE WHEN :sorting = 'customerSupportStatus asc' THEN status END ASC,
    CASE WHEN :sorting = 'customerSupportStatus desc' THEN status END DESC
OFFSET ((GREATEST((:page)::integer, 1) - 1) * (:page_size)::integer) LIMIT (:page_size)::integer;