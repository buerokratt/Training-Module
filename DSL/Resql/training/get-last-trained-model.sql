SELECT * FROM llm_trainings WHERE trained_date = (SELECT max(trained_date) FROM llm_trainings WHERE state = 'Trained' or state = 'DEPLOYED') LIMIT 1;
