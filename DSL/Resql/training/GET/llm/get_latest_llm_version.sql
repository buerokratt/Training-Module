/*
declaration:
  version: 0.1
  description: "Fetch the highest model version number sorted numerically"
  method: get
  namespace: training
  returns: json
  allowlist:
    query: []
  response:
    fields:
      - field: version_number
        type: string
        description: "Version identifier in format major_minor, sorted numerically"
*/
SELECT version_number
FROM llm_trainings
ORDER BY STRING_TO_ARRAY(version_number, '_')::INT [] DESC
LIMIT 1;
