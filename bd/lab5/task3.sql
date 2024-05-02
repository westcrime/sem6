create or replace package journaling as
	procedure recover(restoration_time timestamp);
	procedure recover(time_difference interval day to second);
end;
/

create or replace package body journaling as

	procedure recover(restoration_time timestamp) 
	as
		insert_action_name constant varchar2(32) := 'inserting';
		update_action_name constant varchar2(32) := 'updating';
		delete_action_name constant varchar2(32) := 'deleting';
		reported_action_name constant varchar2(32) := 'reported';
		students_table_name constant varchar2(32) := 'students';
		groups_table_name constant varchar2(32) := 'groups';
		exams_table_name constant varchar2(32) := 'exams';
		id_column_name constant varchar2(32) := 'id';
		name_column_name constant varchar2(32) := 'name';
		c_val_column_name constant varchar2(32) := 'c_val';
		date_and_time_column_name varchar2(32) := 'date_and_time';
		group_id_column_name constant varchar2(32) := 'group_id';
		pattern constant varchar2(16) := '\(([^\)]*)\)';
		split_pattern constant varchar2(16) := '[^, ][^,]*';
		str_index number;
		columns_index number;
		values_index number;
		id_value number;
		name_value varchar2(32);
		c_val_value number;
		date_and_time_value timestamp with local time zone;
		group_id_value number;
		entry_columns varchar2(256);
		entry_values varchar2(256);
		entry_id number;
		current_column varchar2(32);
		current_value varchar2(32);
	begin
		delete from students;
		delete from exams;
		delete from groups;
		for journal_entry in (
			select action_name, table_name, description
			from journal 
			where date_and_time <= restoration_time
			order by date_and_time asc
		) 
		loop
			str_index := 1;
			columns_index := 1;
			values_index := 1;
			case journal_entry.action_name
				when insert_action_name then
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_values from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_columns from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_id from dual;
					case journal_entry.table_name
						when students_table_name then
							loop
								select regexp_substr(entry_columns, split_pattern, columns_index) into current_column from dual;
								select regexp_substr(entry_values, split_pattern, values_index) into current_value from dual;
								select regexp_instr(entry_columns, split_pattern, columns_index, 1, 1) into columns_index from dual;
								select regexp_instr(entry_values, split_pattern, values_index, 1, 1) into values_index from dual;
								exit when columns_index = 0 or values_index = 0;
								case current_column
									when name_column_name then
										name_value := current_value;
									when group_id_column_name then
										group_id_value := current_value;
								end case;	
							end loop;
							insert into students (id, name, group_id) values (entry_id, name_value, group_id_value);
						when exams_table_name then
							loop
								select regexp_substr(entry_columns, split_pattern, columns_index) into current_column from dual;
								select regexp_substr(entry_values, split_pattern, values_index) into current_value from dual;
								select regexp_instr(entry_columns, split_pattern, columns_index, 1, 1) into columns_index from dual;
								select regexp_instr(entry_values, split_pattern, values_index, 1, 1) into values_index from dual;
								exit when columns_index = 0 or values_index = 0;
								case current_column
									when name_column_name then
										name_value := current_value;
									when date_and_time_column_name then
										date_and_time_value := current_value;
									when group_id_column_name then
										group_id_value := current_value;
								end case;	
							end loop;
							insert into exams (id, name, date_and_time, group_id) values (entry_id, name_value, date_and_time_value, group_id_value);
						when groups_table_name then
							loop
								select regexp_substr(entry_columns, split_pattern, columns_index) into current_column from dual;
								select regexp_substr(entry_values, split_pattern, values_index) into current_value from dual;
								select regexp_instr(entry_columns, split_pattern, columns_index, 1, 1) into columns_index from dual;
								select regexp_instr(entry_values, split_pattern, values_index, 1, 1) into values_index from dual;
								exit when columns_index = 0 or values_index = 0;
								case current_column
									when name_column_name then
										name_value := current_value;
									when c_val_column_name then
										c_val_value := current_value;
								end case;	
							end loop;
							insert into groups (id, name, c_val) values (entry_id, name_value, c_val_value);
					end case;
				when update_action_name then
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_values from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_columns from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_id from dual;
					loop
						select regexp_substr(entry_columns, split_pattern, columns_index) into current_column from dual;
						select regexp_substr(entry_values, split_pattern, values_index) into current_value from dual;
						select regexp_instr(entry_columns, split_pattern, columns_index, 1, 1) into columns_index from dual;
						select regexp_instr(entry_values, split_pattern, values_index, 1, 1) into values_index from dual;
						exit when columns_index = 0 or values_index = 0;
						case journal_entry.table_name
							when students_table_name then
								case current_column
									when id_column_name then
										id_value := current_value;
									when name_column_name then
										update students set name = current_value where id = entry_id;
									when group_id_column_name then
										update students set group_id = current_value where id = entry_id;
								end case;
								if id_value is not null then
									update students set id = id_value where id = entry_id;
								end if;
							when exams_table_name then
								case current_column
									when id_column_name then
										id_value := current_value;
									when name_column_name then
										update exams set name = current_value where id = entry_id;
									when date_and_time_column_name then
										update exams set date_and_time = current_value where id = entry_id;
									when group_id_column_name then
										update exams set group_id = current_value where id = entry_id;
								end case;
								if id_value is not null then
									update exams set id = id_value where id = entry_id;
								end if;
							when groups_table_name then
								case current_column
									when id_column_name then
										id_value := current_value;
									when name_column_name then
										update groups set name = current_value where id = entry_id;
									when c_val_column_name then
										update groups set c_val = current_value where id = entry_id;
								end case;
								if id_value is not null then
									update groups set id = id_value where id = entry_id;
								end if;
						end case;
					end loop;
				when delete_action_name then
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_id from dual;
					case journal_entry.table_name
						when students_table_name then
							delete from students where id = entry_id;
						when exams_table_name then
							delete from exams where id = entry_id;
						when groups_table_name then
							delete from groups where id = entry_id;
					end case;
				when reported_action_name then
					null;
			end case;
		end loop;
		delete from journal where date_and_time > restoration_time;
	end;

	procedure recover(time_difference interval day to second) 
	as
		insert_action_name constant varchar2(32) := 'inserting';
		update_action_name constant varchar2(32) := 'updating';
		delete_action_name constant varchar2(32) := 'deleting';
		reported_action_name constant varchar2(32) := 'reported';
		students_table_name constant varchar2(32) := 'students';
		groups_table_name constant varchar2(32) := 'groups';
		exams_table_name constant varchar2(32) := 'exams';
		id_column_name constant varchar2(32) := 'id';
		name_column_name constant varchar2(32) := 'name';
		c_val_column_name constant varchar2(32) := 'c_val';
		date_and_time_column_name varchar2(32) := 'date_and_time';
		group_id_column_name constant varchar2(32) := 'group_id';
		pattern constant varchar2(16) := '\(([^\)]*)\)';
		split_pattern constant varchar2(16) := '[^, ][^,]*';
		str_index number;
		columns_index number;
		old_values_index number;
		new_values_index number;
		id_value number;
		name_value varchar2(32);
		c_val_value number;
		date_and_time_value timestamp with local time zone;
		group_id_value number;
		entry_columns varchar2(256);
		entry_old_values varchar2(256);
		entry_new_values varchar2(256);
		entry_id number;
		current_column varchar2(32);
		current_value_old varchar2(32);
		current_value_new varchar2(32);
		current_time timestamp;
	begin
		select LOCALTIMESTAMP into current_time from dual;
		for journal_entry in (
			select action_name, table_name, description
			from journal 
			where date_and_time > current_time - time_difference
			order by date_and_time desc
		) 
		loop
			str_index := 1;
			columns_index := 1;
			old_values_index := 1;
			new_values_index := 1;
			case journal_entry.action_name
				when insert_action_name then
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_id from dual;
					case journal_entry.table_name
						when students_table_name then
							delete from students where id = entry_id;
						when exams_table_name then
							delete from exams where id = entry_id;
						when groups_table_name then
							delete from groups where id = entry_id;
					end case;
				when update_action_name then
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_old_values from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_new_values from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_columns from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_id from dual;
					loop
						select regexp_substr(entry_columns, split_pattern, columns_index) into current_column from dual;
						select regexp_substr(entry_old_values, split_pattern, old_values_index) into current_value_old from dual;
						select regexp_substr(entry_new_values, split_pattern, new_values_index) into current_value_new from dual;
						select regexp_instr(entry_columns, split_pattern, columns_index, 1, 1) into columns_index from dual;
						select regexp_instr(entry_old_values, split_pattern, old_values_index, 1, 1) into old_values_index from dual;
						select regexp_instr(entry_new_values, split_pattern, new_values_index, 1, 1) into new_values_index from dual;
						exit when columns_index = 0 or old_values_index = 0 or new_values_index = 0;
						case journal_entry.table_name
							when students_table_name then
								case current_column
									when id_column_name then
										id_value := current_value_old;
										entry_id := current_value_new;
									when name_column_name then
										name_value := current_value_old;
									when group_id_column_name then
										group_id_value := current_value_old;
								end case;
								if name_value is not null then
									update students set name = name_value where id = entry_id;
								end if;
								if group_id_value is not null then
									update students set group_id = group_id_value where id = entry_id;
								end if;
								if id_value is not null then
									update students set id = id_value where id = entry_id;
								end if;	
							when exams_table_name then
								case current_column
									when id_column_name then
										id_value := current_value_old;
										entry_id := current_value_new;
									when name_column_name then
										update exams set name = current_value_old where id = entry_id;
									when date_and_time_column_name then
										update exams set date_and_time = current_value_old where id = entry_id;
									when group_id_column_name then
										update exams set group_id = current_value_old where id = entry_id;
								end case;
								if name_value is not null then
									update exams set name = name_value where id = entry_id;
								end if;
								if date_and_time_value is not null then
									update exams set date_and_time = date_and_time_value where id = entry_id;
								end if;
								if group_id_value is not null then
									update exams set group_id = group_id_value where id = entry_id;
								end if;
								if id_value is not null then
									update exams set id = id_value where id = entry_id;
								end if;
							when groups_table_name then
								case current_column
									when id_column_name then
										id_value := current_value_old;
										entry_id := current_value_new;
									when name_column_name then
										update groups set name = current_value_old where id = entry_id;
									when c_val_column_name then
										update groups set c_val = current_value_old where id = entry_id;
								end case;
								if name_value is not null then
									update groups set name = name_value where id = entry_id;
								end if;
								if c_val_value is not null then
									update groups set c_val = c_val_value where id = entry_id;
								end if;
								if id_value is not null then
									update groups set id = id_value where id = entry_id;
								end if;
						end case;
					end loop;
				when delete_action_name then
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_old_values from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_columns from dual;
					select regexp_instr(journal_entry.description, pattern, str_index, 1, 1) into str_index from dual;
					select regexp_substr(journal_entry.description, pattern, str_index, 1, 'i', 1) into entry_id from dual;
					case journal_entry.table_name
						when students_table_name then
							loop
								select regexp_substr(entry_columns, split_pattern, columns_index) into current_column from dual;
								select regexp_substr(entry_old_values, split_pattern, old_values_index) into current_value_old from dual;
								select regexp_instr(entry_columns, split_pattern, columns_index, 1, 1) into columns_index from dual;
								select regexp_instr(entry_old_values, split_pattern, old_values_index, 1, 1) into old_values_index from dual;
								exit when columns_index = 0 or old_values_index = 0;
								case current_column
									when name_column_name then
										name_value := current_value_old;
									when group_id_column_name then
										group_id_value := current_value_old;
								end case;	
							end loop;
							insert into students (id, name, group_id) values (entry_id, name_value, group_id_value);
						when exams_table_name then
							loop
								select regexp_substr(entry_columns, split_pattern, columns_index) into current_column from dual;
								select regexp_substr(entry_old_values, split_pattern, old_values_index) into current_value_old from dual;
								select regexp_instr(entry_columns, split_pattern, columns_index, 1, 1) into columns_index from dual;
								select regexp_instr(entry_old_values, split_pattern, old_values_index, 1, 1) into old_values_index from dual;
								exit when columns_index = 0 or old_values_index = 0;
								case current_column
									when name_column_name then
										name_value := current_value_old;
									when date_and_time_column_name then
										date_and_time_value := current_value_old;
									when group_id_column_name then
										group_id_value := current_value_old;
								end case;	
							end loop;
							insert into exams (id, name, date_and_time, group_id) values (entry_id, name_value, date_and_time_value, group_id_value);
						when groups_table_name then
							loop
								select regexp_substr(entry_columns, split_pattern, columns_index) into current_column from dual;
								select regexp_substr(entry_old_values, split_pattern, old_values_index) into current_value_old from dual;
								select regexp_instr(entry_columns, split_pattern, columns_index, 1, 1) into columns_index from dual;
								select regexp_instr(entry_old_values, split_pattern, old_values_index, 1, 1) into old_values_index from dual;
								exit when columns_index = 0 or old_values_index = 0;
								case current_column
									when name_column_name then
										name_value := current_value_old;
									when c_val_column_name then
										c_val_value := current_value_old;
								end case;	
							end loop;
							insert into groups (id, name, c_val) values (entry_id, name_value, c_val_value);
					end case;
				when reported_action_name then
					null;
			end case;
		end loop;
		delete from journal where date_and_time > current_time - time_difference;
	end;
	
end;
/