SELECT * FROM intent WHERE intent = :intent AND status = 'ACTIVE' ORDER BY start_date DESC LIMIT 1;
