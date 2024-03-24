-- Триггер для обновления информации C_VAL при изменении данных в таблице STUDENTS

create or replace trigger update_groups_cval before insert or update or delete of group_id on students for each row
declare
	old_c_val number;
	new_c_val number;
	mutating_exception exception;
	pragma exception_init(mutating_exception, -04091);
begin
	case
		when inserting then
			update groups set c_val = c_val + 1 where id = :new.group_id;
		when updating then
			update groups set c_val = c_val - 1 where id = :old.group_id;
			update groups set c_val = c_val + 1 where id = :new.group_id;
		when deleting then
			update groups set c_val = c_val - 1 where id = :old.group_id;
	end case;
exception
	when mutating_exception then
		null;
end;
/