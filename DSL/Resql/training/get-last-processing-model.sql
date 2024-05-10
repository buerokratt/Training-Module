SELECT * FROM llm_trainings WHERE trained_date = (SELECT max(trained_date) FROM llm_trainings WHERE state = 'PROCESSING') LIMIT 1;
