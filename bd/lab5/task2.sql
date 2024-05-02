create table journal (
	id number generated always as identity,
	action_name varchar2(32) not null,
	table_name varchar2(32),
	description varchar2(512),
	date_and_time timestamp with local time zone not null
);
create or replace trigger students_journaling_trigger after insert or update or delete on students for each row
declare
	insert_str constant varchar2(128) := 'inserted values ({}) for columns ({}) on id ({})';
	update_str constant varchar2(128) := 'updated values ({}) to values ({}) for columns ({}) on id ({})';
	delete_str constant varchar2(128) := 'deleted values ({}) for columns ({}) on id ({})';
	pattern constant varchar(16) := '\{\}';
	delimetr constant varchar2(16) := ', ';
	insert_action_name constant varchar2(32) := 'inserting';
	update_action_name constant varchar2(32) := 'updating';
	delete_action_name constant varchar2(32) := 'deleting';
	table_name constant varchar2(32) := 'students';
	id_column_name constant varchar2(32) := 'id';
	name_column_name constant varchar2(32) := 'name';
	group_id_column_name constant varchar2(32) := 'group_id';
	action_date_and_time timestamp with local time zone;
	result_old_values varchar2(256);
	result_new_values varchar2(256);
	result_columns varchar2(256);
	result_description varchar2(512);
	result_action_name varchar2(32);
begin
	select LOCALTIMESTAMP into action_date_and_time from dual;
	case
		when inserting then
			result_action_name := insert_action_name;
			result_description := insert_str;
			result_columns := name_column_name || delimetr || group_id_column_name;
			result_new_values := :new.name || delimetr || :new.group_id;
			select regexp_replace(result_description, pattern, result_new_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_columns, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, :new.id, 1, 1) into result_description from dual;
		when updating then
			result_action_name := update_action_name;
			result_description := update_str;
			if :old.id != :new.id then
				result_columns := result_columns || id_column_name || delimetr;
				result_new_values := result_new_values || :new.id || delimetr;
				result_old_values := result_old_values || :old.id || delimetr;
			end if;
			if :old.name != :new.name then
				result_columns := result_columns || name_column_name || delimetr;
				result_new_values := result_new_values || :new.name || delimetr;
				result_old_values := result_old_values || :old.name || delimetr;
			end if;
			if :old.group_id != :new.group_id then
				result_columns := result_columns || group_id_column_name || delimetr;
				result_new_values := result_new_values || :new.group_id || delimetr;
				result_old_values := result_old_values || :old.group_id || delimetr;
			end if;
			select regexp_replace(result_description, pattern, result_old_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_new_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_columns, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, :old.id, 1, 1) into result_description from dual;
		when deleting then
			result_action_name := delete_action_name;
			result_description := delete_str;
			result_columns := name_column_name || delimetr || group_id_column_name;
			result_old_values := :old.name || delimetr || :old.group_id;
			select regexp_replace(result_description, pattern, result_old_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_columns, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, :old.id, 1, 1) into result_description from dual;
	end case;
	insert into journal (
		action_name, 
		table_name,
		description,
		date_and_time
	) values (
		result_action_name,
		table_name,
		result_description,
		action_date_and_time
	);
end;
/
create or replace trigger exams_journaling_trigger after insert or update or delete on exams for each row
declare
	insert_str constant varchar2(128) := 'inserted values ({}) for columns ({}) on id ({})';
	update_str constant varchar2(128) := 'updated values ({}) to values ({}) for columns ({}) on id ({})';
	delete_str constant varchar2(128) := 'deleted values ({}) for columns ({}) on id ({})';
	pattern constant varchar(16) := '\{\}';
	delimetr constant varchar2(16) := ', ';
	insert_action_name constant varchar2(32) := 'inserting';
	update_action_name constant varchar2(32) := 'updating';
	delete_action_name constant varchar2(32) := 'deleting';
	table_name constant varchar2(32) := 'exams';
	id_column_name constant varchar2(32) := 'id';
	name_column_name constant varchar2(32) := 'name';
	date_and_time_column_name constant varchar2(32) := 'date_and_time';
	group_id_column_name constant varchar2(32) := 'group_id';
	action_date_and_time timestamp with local time zone;
	result_old_values varchar2(256);
	result_new_values varchar2(256);
	result_columns varchar2(256);
	result_description varchar2(512);
	result_action_name varchar2(32);
begin
	select LOCALTIMESTAMP into action_date_and_time from dual;
	case
		when inserting then
			result_action_name := insert_action_name;
			result_description := insert_str;
			result_columns := name_column_name || delimetr || date_and_time_column_name || delimetr || group_id_column_name;
			result_new_values := :new.name || delimetr || :new.date_and_time || delimetr || :new.group_id;
			select regexp_replace(result_description, pattern, result_new_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_columns, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, :new.id, 1, 1) into result_description from dual;
		when updating then
			result_action_name := update_action_name;
			result_description := update_str;
			if :old.id != :new.id then
				result_columns := result_columns || id_column_name || delimetr;
				result_new_values := result_new_values || :new.id || delimetr;
				result_old_values := result_old_values || :old.id || delimetr;
			end if;
			if :old.name != :new.name then
				result_columns := result_columns || name_column_name || delimetr;
				result_new_values := result_new_values || :new.name || delimetr;
				result_old_values := result_old_values || :old.name || delimetr;
			end if;
			if :old.date_and_time != :new.date_and_time then
				result_columns := result_columns || date_and_time_column_name || delimetr;
				result_new_values := result_new_values || :new.date_and_time || delimetr;
				result_old_values := result_old_values || :old.date_and_time || delimetr;
			end if;
			if :old.group_id != :new.group_id then
				result_columns := result_columns || group_id_column_name || delimetr;
				result_new_values := result_new_values || :new.group_id || delimetr;
				result_old_values := result_old_values || :old.group_id || delimetr;
			end if;
			select regexp_replace(result_description, pattern, result_old_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_new_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_columns, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, :old.id, 1, 1) into result_description from dual;
		when deleting then
			result_action_name := delete_action_name;
			result_description := delete_str;
			result_columns := name_column_name || delimetr || date_and_time_column_name || delimetr || group_id_column_name;
			result_old_values := :old.name || delimetr || :old.date_and_time || delimetr || :old.group_id;
			select regexp_replace(result_description, pattern, result_old_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_columns, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, :old.id, 1, 1) into result_description from dual;
	end case;
	insert into journal (
		action_name, 
		table_name,
		description,
		date_and_time
	) values (
		result_action_name,
		table_name,
		result_description,
		action_date_and_time
	);
end;
/
create or replace trigger groups_journaling_trigger after insert or update or delete on groups for each row
declare
	insert_str constant varchar2(128) := 'inserted values ({}) for columns ({}) on id ({})';
	update_str constant varchar2(128) := 'updated values ({}) to values ({}) for columns ({}) on id ({})';
	delete_str constant varchar2(128) := 'deleted values ({}) for columns ({}) on id ({})';
	pattern constant varchar(16) := '\{\}';
	delimetr constant varchar2(16) := ', ';
	insert_action_name constant varchar2(32) := 'inserting';
	update_action_name constant varchar2(32) := 'updating';
	delete_action_name constant varchar2(32) := 'deleting';
	table_name constant varchar2(32) := 'groups';
	id_column_name constant varchar2(32) := 'id';
	name_column_name constant varchar2(32) := 'name';
	c_val_column_name constant varchar2(32) := 'c_val';
	action_date_and_time timestamp with local time zone;
	result_old_values varchar2(256);
	result_new_values varchar2(256);
	result_columns varchar2(256);
	result_description varchar2(512);
	result_action_name varchar2(32);
begin
	select LOCALTIMESTAMP into action_date_and_time from dual;
	case
		when inserting then
			result_action_name := insert_action_name;
			result_description := insert_str;
			result_columns := name_column_name || delimetr || c_val_column_name;
			result_new_values := :new.name || delimetr || :new.c_val;
			select regexp_replace(result_description, pattern, result_new_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_columns, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, :new.id, 1, 1) into result_description from dual;
		when updating then
			result_action_name := update_action_name;
			result_description := update_str;
			if :old.id != :new.id then
				result_columns := result_columns || id_column_name || delimetr;
				result_new_values := result_new_values || :new.id || delimetr;
				result_old_values := result_old_values || :old.id || delimetr;
			end if;
			if :old.name != :new.name then
				result_columns := result_columns || name_column_name || delimetr;
				result_new_values := result_new_values || :new.name || delimetr;
				result_old_values := result_old_values || :old.name || delimetr;
			end if;
			if :old.c_val != :new.c_val then
				result_columns := result_columns || c_val_column_name || delimetr;
				result_new_values := result_new_values || :new.c_val || delimetr;
				result_old_values := result_old_values || :old.c_val || delimetr;
			end if;
			select regexp_replace(result_description, pattern, result_old_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_new_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_columns, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, :old.id, 1, 1) into result_description from dual;
		when deleting then
			result_action_name := delete_action_name;
			result_description := delete_str;
			result_columns := name_column_name || delimetr || c_val_column_name;
			result_old_values := :old.name || delimetr || :old.c_val;
			select regexp_replace(result_description, pattern, result_old_values, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, result_columns, 1, 1) into result_description from dual;
			select regexp_replace(result_description, pattern, :old.id, 1, 1) into result_description from dual;
	end case;
	insert into journal (
		action_name, 
		table_name,
		description,
		date_and_time
	) values (
		result_action_name,
		table_name,
		result_description,
		action_date_and_time
	);
end;
/
