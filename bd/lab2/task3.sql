-- Триггер реализующий каскадное удаление студентов при удалении группы

CREATE OR REPLACE TRIGGER students_fk
BEFORE DELETE ON groups
FOR EACH ROW
BEGIN
    DELETE FROM students WHERE group_id = :OLD.id;
END;
/

create or replace trigger students_group_id_foreign_key_trigger before insert or update of group_id on students for each row
declare
	fk_error_id constant number := -20007;
	fk_error_message constant varchar(64) := 'There is no such group!';
	groups_with_id number;
begin
	select count(*) into groups_with_id from groups where id = :new.group_id;
	if groups_with_id < 1 then
		raise_application_error(fk_error_id, fk_error_message);
	end if;
end;
/