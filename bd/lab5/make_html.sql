spool script.html

declare
r_time timestamp with local time zone;
begin
select date_and_time into r_time from journal where id=50;
reporting.report(r_time);
end;
/

-- declare
-- r_time timestamp with local time zone;
-- begin
-- reporting.report();
-- end;
-- /

spool off