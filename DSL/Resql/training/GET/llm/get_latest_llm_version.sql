SELECT version_number
FROM   llm.llm_trainings
ORDER  BY string_to_array(version_number, '_')::int[] DESC
LIMIT 1;