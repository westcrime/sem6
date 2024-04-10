spool script.sql
select compare_schema_alter('DEV', 'PROD') from dual;
spool off