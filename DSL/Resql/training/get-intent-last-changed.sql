SELECT * FROM intent WHERE intent = :intent AND status = 'ACTIVE' ORDER BY created DESC LIMIT 1;
