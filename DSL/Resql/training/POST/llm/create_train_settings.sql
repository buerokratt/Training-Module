/*
declaration:
  version: 0.1
  description: "Insert new training settings including scheduling, date, and modifier information"
  method: post
  accepts: json
  returns: json
  namespace: security
  allowlist:
    body:
      - field: rasa_folds
        type: integer
        description: "Number of folds for Rasa model training"
      - field: scheduled
        type: boolean
        description: "Flag indicating if training is scheduled"
      - field: days_of_week
        type: string
        description: "Days of the week for scheduled training, e.g., 'Mon,Wed,Fri'"
      - field: from_date
        type: timestamp
        description: "Start date and time in ISO format"
      - field: modifier_id
        type: string
        description: "ID of the user who modified the settings"
      - field: modifier_name
        type: string
        description: "Name of the user who modified the settings"
  response:
    fields: []
*/

INSERT INTO train_settings (
    rasa_folds,
    scheduled,
    days_of_week,
    from_date,
    last_modified,
    modifier_id,
    modifier_name
)
VALUES (
    :rasa_folds,
    :scheduled,
    :days_of_week,
    TO_TIMESTAMP(:from_date, 'YYYY-MM-DD"T"HH24:MI:SS'),
    CURRENT_TIMESTAMP,
    :modifier_id,
    :modifier_name
);
