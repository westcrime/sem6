-- Триггеры для проверки на уникальность имен и id групп и студентов

create or replace trigger check_groups_name_unique for insert or update of name on groups
compound trigger
	type group_names_table is table of varchar(32);
	group_names group_names_table;
	unique_name_error_id constant number := -20005;
	unique_name_error_message constant varchar(64) := 'Name must be unique!';
	
	before statement is
	begin
		select name bulk collect into group_names from groups;
	end before statement;

	before each row is
	begin
		for i in 1..group_names.count()
		loop
			if group_names(i) = :new.name then
				raise_application_error(unique_name_error_id, unique_name_error_message);
			end if;
		end loop;
	end before each row;
end;
/

create or replace trigger check_groups_id_unique for insert or update of id on groups
compound trigger
	type group_ids_table is table of number;
	group_ids group_ids_table;
	unique_id_error_id constant number := -20005;
	unique_id_error_message constant varchar(64) := 'id must be unique!';
	
	before statement is
	begin
		select id bulk collect into group_ids from groups;
	end before statement;

	before each row is
	begin
		for i in 1..group_ids.count()
		loop
			if group_ids(i) = :new.id then
				raise_application_error(unique_id_error_id, unique_id_error_message);
			end if;
		end loop;
	end before each row;
end;
/

create or replace trigger check_students_name_unique for insert or update of name on students
compound trigger
	type student_names_table is table of varchar(32);
	student_names student_names_table;
	unique_name_error_id constant number := -20005;
	unique_name_error_message constant varchar(64) := 'Name must be unique!';
	
	before statement is
	begin
		select name bulk collect into student_names from students;
	end before statement;

	before each row is
	begin
		for i in 1..student_names.count()
		loop
			if student_names(i) = :new.name then
				raise_application_error(unique_name_error_id, unique_name_error_message);
			end if;
		end loop;
	end before each row;
end;
/

create or replace trigger check_students_id_unique for insert or update of id on students
compound trigger
	type student_ids_table is table of number;
	student_ids student_ids_table;
	unique_id_error_id constant number := -20005;
	unique_id_error_message constant varchar(64) := 'id must be unique!';
	
	before statement is
	begin
		select id bulk collect into student_ids from students;
	end before statement;

	before each row is
	begin
		for i in 1..student_ids.count()
		loop
			if student_ids(i) = :new.id then
				raise_application_error(unique_id_error_id, unique_id_error_message);
			end if;
		end loop;
	end before each row;
end;
/

-- Триггеры для генерации автоинкрементного ключа

CREATE OR REPLACE TRIGGER autoincrement_students
BEFORE INSERT ON students
FOR EACH ROW
declare
	max_id number;
begin
	if :new.id is null then
		select max(id) into max_id from students;
		if max_id is null then
			max_id := 0;
		else
			max_id := max_id + 1;
		end if;
		:new.id := max_id;
	end if;
end;
/

CREATE OR REPLACE TRIGGER autoincrement_groups
BEFORE INSERT ON groups
FOR EACH ROW
declare
	max_id number;
begin
	if :new.id is null then
		select max(id) into max_id from groups;
		if max_id is null then
			max_id := 0;
		else
			max_id := max_id + 1;
		end if;
		:new.id := max_id;
	end if;
end;
/