-- insert into groups (name, c_val) values ('group1', 0);
-- insert into groups (name, c_val) values ('group2', 0);
-- insert into students (name, group_id) values ('dima3', 0);
-- insert into students (name, group_id) values ('dima4', 1);
-- UPDATE STUDENTS SET NAME = 'Sasha' WHERE ID = 1;
-- DELETE FROM STUDENTS WHERE ID = 1;
-- truncate table students;
BEGIN
    restore_students(TO_DATE('2024-03-27 09:31:00', 'YYYY-MM-DD HH24:MI:SS'));
END;
/