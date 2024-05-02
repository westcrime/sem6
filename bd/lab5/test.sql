/*declare
r_time timestamp with local time zone;
begin
select date_and_time into r_time from journal where id=73;
journaling.recover(r_time);
end;
/
*/
/*declare
r_time timestamp with local time zone;
begin
select date_and_time into r_time from journal where id=161;
journaling.recover(LOCALTIMESTAMP - r_time);
end;
/
*/
declare
r_time timestamp with local time zone;
begin
select date_and_time into r_time from journal where id=20;
reporting.report(r_time);
end;
/