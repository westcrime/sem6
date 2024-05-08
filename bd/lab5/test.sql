
declare
r_time timestamp with local time zone;
begin
select date_and_time into r_time from journal where id=60;
journaling.recover(r_time);
end;
/

/*
declare
r_time timestamp with local time zone;
begin
select date_and_time into r_time from journal where id=;
journaling.recover(LOCALTIMESTAMP - r_time);
end;
/
*/
