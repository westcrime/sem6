create or replace package reporting as
	procedure report(restoration_time timestamp);
	procedure report;
end;
/

create or replace package body reporting as

	procedure report(restoration_time timestamp) 
	as
        insert_action_name constant varchar2(32) := 'inserting';
        update_action_name constant varchar2(32) := 'updating';
        delete_action_name constant varchar2(32) := 'deleting';
        reported_action_name constant varchar2(32) := 'reported';
        action_date_and_time timestamp with local time zone;
        groups_inserted number := 0;
        groups_deleted number := 0;
        groups_updated number := 0;
        students_inserted number := 0;
        students_deleted number := 0;
        students_updated number := 0;
        exams_inserted number := 0;
        exams_deleted number := 0;
        exams_updated number := 0;
        param_val   owa.vc_arr;
        result clob;
    begin
        select LOCALTIMESTAMP into action_date_and_time from dual;

        if restoration_time is not null then
            select count(*) into groups_inserted from journal where date_and_time > restoration_time and table_name = 'groups' and action_name = insert_action_name;
            select count(*) into groups_updated from journal where date_and_time > restoration_time and table_name = 'groups' and action_name = update_action_name;
            select count(*) into groups_deleted from journal where date_and_time > restoration_time and table_name = 'groups' and action_name = delete_action_name;
            select count(*) into exams_inserted from journal where date_and_time > restoration_time and table_name = 'exams' and action_name = insert_action_name;
            select count(*) into exams_updated from journal where date_and_time > restoration_time and table_name = 'exams' and action_name = update_action_name;
            select count(*) into exams_deleted from journal where date_and_time > restoration_time and table_name = 'exams' and action_name = delete_action_name;
            select count(*) into students_inserted from journal where date_and_time > restoration_time and table_name = 'students' and action_name = insert_action_name;
            select count(*) into students_updated from journal where date_and_time > restoration_time and table_name = 'students' and action_name = update_action_name;
            select count(*) into students_deleted from journal where date_and_time > restoration_time and table_name = 'students' and action_name = delete_action_name;
        end if;

        result := '<html><head><title>Journal Report</title></head><body>';
        result := result || '<h2>Journal Recovery Report</h2>';
        result := result || '<table border="1">';
        result := result || '<tr><th>Table Name</th><th>Inserted</th><th>Updated</th><th>Deleted</th></tr>';
        result := result || '<tr><td>Groups</td><td>' || groups_inserted || '</td><td>' || groups_updated || '</td><td>' || groups_deleted || '</td></tr>';
        result := result || '<tr><td>Exams</td><td>' || exams_inserted || '</td><td>' || exams_updated || '</td><td>' || exams_deleted || '</td></tr>';
        result := result || '<tr><td>Students</td><td>' || students_inserted || '</td><td>' || students_updated || '</td><td>' || students_deleted || '</td></tr>';
        result := result || '</table></body></html>';

        result := result || '<br/><h2>Entries</h2>';
        result := result || '<ol>';
        for entry in (select * from journal where date_and_time > restoration_time and action_name != reported_action_name order by date_and_time)
        loop
            result := result || '<li>' || entry.description || ' for table ' || entry.table_name || '</li>';
        end loop;
        result := result || '</ol>';

        param_val (1) := 1;
        owa.init_cgi_env (param_val);
        htp.p(result);
        htp.showpage();

        insert into journal (
            action_name, 
            date_and_time
        ) values (
            reported_action_name,
            action_date_and_time
        );
    end;

	procedure report
	as
        insert_action_name constant varchar2(32) := 'inserting';
        update_action_name constant varchar2(32) := 'updating';
        delete_action_name constant varchar2(32) := 'deleting';
        reported_action_name constant varchar2(32) := 'reported';
        action_date_and_time timestamp with local time zone;
        restoration_time timestamp;
        groups_inserted number := 0;
        groups_deleted number := 0;
        groups_updated number := 0;
        students_inserted number := 0;
        students_deleted number := 0;
        students_updated number := 0;
        exams_inserted number := 0;
        exams_deleted number := 0;
        exams_updated number := 0;
        param_val   owa.vc_arr;
        result clob;
    begin
        select LOCALTIMESTAMP into action_date_and_time from dual;
        
        select max(date_and_time) into restoration_time from journal where action_name = reported_action_name;

        if restoration_time is null then
            select min(date_and_time) - 1 into restoration_time from journal;
        end if;

        if restoration_time is not null then
            select count(*) into groups_inserted from journal where date_and_time > restoration_time and table_name = 'groups' and action_name = insert_action_name;
            select count(*) into groups_updated from journal where date_and_time > restoration_time and table_name = 'groups' and action_name = update_action_name;
            select count(*) into groups_deleted from journal where date_and_time > restoration_time and table_name = 'groups' and action_name = delete_action_name;
            select count(*) into exams_inserted from journal where date_and_time > restoration_time and table_name = 'exams' and action_name = insert_action_name;
            select count(*) into exams_updated from journal where date_and_time > restoration_time and table_name = 'exams' and action_name = update_action_name;
            select count(*) into exams_deleted from journal where date_and_time > restoration_time and table_name = 'exams' and action_name = delete_action_name;
            select count(*) into students_inserted from journal where date_and_time > restoration_time and table_name = 'students' and action_name = insert_action_name;
            select count(*) into students_updated from journal where date_and_time > restoration_time and table_name = 'students' and action_name = update_action_name;
            select count(*) into students_deleted from journal where date_and_time > restoration_time and table_name = 'students' and action_name = delete_action_name;
        end if;

        result := '<html><head><title>Journal Report</title></head><body>';
        result := result || '<h2>Journal Recovery Report</h2>';
        result := result || '<table border="1">';
        result := result || '<tr><th>Table Name</th><th>Inserted</th><th>Updated</th><th>Deleted</th></tr>';
        result := result || '<tr><td>Groups</td><td>' || groups_inserted || '</td><td>' || groups_updated || '</td><td>' || groups_deleted || '</td></tr>';
        result := result || '<tr><td>Exams</td><td>' || exams_inserted || '</td><td>' || exams_updated || '</td><td>' || exams_deleted || '</td></tr>';
        result := result || '<tr><td>Students</td><td>' || students_inserted || '</td><td>' || students_updated || '</td><td>' || students_deleted || '</td></tr>';
        result := result || '</table></body></html>';

        result := result || '<br/><h2>Entries</h2>';
        result := result || '<ol>';
        for entry in (select * from journal where date_and_time > restoration_time and action_name != reported_action_name order by date_and_time)
        loop
            result := result || '<li>' || entry.description || ' for table ' || entry.table_name || '</li>';
        end loop;
        result := result || '</ol>';

        param_val (1) := 1;
        owa.init_cgi_env (param_val);
        htp.p(result);
        htp.showpage();

        insert into journal (
            action_name, 
            date_and_time
        ) values (
            reported_action_name,
            action_date_and_time
        );
    end;
end;
/