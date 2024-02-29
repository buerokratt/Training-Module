select file_name, version_number , state , image_version ,MAX(trained_date) as trained_date from llm_trainings
group by (file_name,version_number,state ,image_version);