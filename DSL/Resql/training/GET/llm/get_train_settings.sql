SELECT id, rasa_folds, scheduled, days_of_week, from_date, last_modified, modifier_id, modifier_name
FROM train_settings
WHERE id = (
  SELECT max(id)
  FROM train_settings
);
