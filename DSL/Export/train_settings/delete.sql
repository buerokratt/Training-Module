DELETE FROM train_settings
WHERE last_modified != (SELECT max(last_modified) FROM train_settings)
    AND last_modified < %(export_boundary)s;
