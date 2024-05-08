spool script.html
declare
r_time timestamp with local time zone;
begin
select date_and_time into r_time from journal where id=17;
reporting.report(r_time);
end;
/
spool off