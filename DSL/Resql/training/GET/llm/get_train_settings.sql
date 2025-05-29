/*
declaration:
  version: 0.1
  description: "Fetch the most recent training settings"
  method: get
  namespace: training
  returns: json
  allowlist:
    query: []
  response:
    fields:
      - field: id
        type: integer
        description: "Primary key of the training settings"
      - field: rasa_folds
        type: integer
        description: "Number of Rasa cross-validation folds"
      - field: scheduled
        type: boolean
        description: "Flag indicating if training is scheduled"
      - field: days_of_week
        type: string
        description: "Comma-separated list of weekdays for training schedule"
      - field: from_date
        type: timestamp
        description: "Start date for the training schedule"
      - field: last_modified
        type: timestamp
        description: "Timestamp of last modification"
      - field: modifier_id
        type: string
        description: "ID of the user who last modified the settings"
      - field: modifier_name
        type: string
        description: "Name of the user who last modified the settings"
*/
SELECT id, rasa_folds, scheduled, days_of_week, from_date, last_modified, modifier_id, modifier_name
FROM train_settings
ORDER BY last_modified DESC
LIMIT 1;