-- Запросы для создания таблиц студентов и групп

CREATE TABLE students (
    id NUMBER,
    name VARCHAR2(256),
    group_id NUMBER
);

CREATE TABLE groups (
    id NUMBER,
    name VARCHAR2(256),
    c_val NUMBER
);

-- Триггеры для проверки на уникальность имен групп

CREATE OR REPLACE TRIGGER check_groups_name_unique
BEFORE INSERT OR UPDATE ON GROUPS
FOR EACH ROW 
DECLARE
	v_count NUMBER;
BEGIN 
	SELECT COUNT(*) INTO v_count FROM GROUPS WHERE Name = :NEW.NAME;
	IF v_count > 0 THEN 
		RAISE_APPLICATION_ERROR(-20001, 'Name of group must be unique');
	END IF;
END;

-- Триггеры для генерации автоинкрементного ключа

CREATE SEQUENCE students_seq
START WITH 1
INCREMENT BY 1
NOCACHE;

CREATE OR REPLACE TRIGGER autoincrement_students
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
    SELECT students_seq.nextval INTO :NEW.id FROM dual;
END;

CREATE SEQUENCE groups_seq
START WITH 1
INCREMENT BY 1
NOCACHE;

CREATE OR REPLACE TRIGGER autoincrement_groups
BEFORE INSERT ON groups
FOR EACH ROW
BEGIN
    SELECT groups_seq.nextval INTO :NEW.id FROM dual;
END;

-- Триггер реализующий каскадное удаление студентов при удалении группы

CREATE OR REPLACE TRIGGER students_fk
BEFORE DELETE ON groups
FOR EACH ROW
BEGIN
    DELETE FROM students WHERE group_id = :OLD.id;
END;

-- Таблица журнала

CREATE TABLE STUDENTS_LOG (
    LOG_ID NUMBER PRIMARY KEY,
	STUDENT_ID NUMBER,
    NAME VARCHAR2(100),
    GROUP_ID NUMBER,
    OPERATION VARCHAR2(10),
    LOG_DATE DATE DEFAULT SYSDATE
);

-- Триггер для журналирования всех действий

CREATE SEQUENCE log_id_seq;

CREATE OR REPLACE TRIGGER students_audit
AFTER INSERT OR UPDATE OR DELETE ON STUDENTS
FOR EACH ROW
DECLARE
    v_operation VARCHAR2(10);
    v_id NUMBER;
    v_name VARCHAR2(100);
    v_group_id NUMBER;
BEGIN
    IF INSERTING THEN
        v_operation := 'INSERT';
        v_id := :NEW.ID;
        v_name := :NEW.NAME;
        v_group_id := :NEW.GROUP_ID;
    ELSIF UPDATING THEN
        v_operation := 'UPDATE';
        v_id := :OLD.ID;
        v_name := :OLD.NAME;
        v_group_id := :OLD.GROUP_ID;
    ELSE
        v_operation := 'DELETE';
        v_id := :OLD.ID;
        v_name := :OLD.NAME;
        v_group_id := :OLD.GROUP_ID;
    END IF;

    INSERT INTO STUDENTS_LOG (LOG_ID, STUDENT_ID, NAME, GROUP_ID, OPERATION, LOG_DATE)
    VALUES (log_id_seq.NEXTVAL, v_id, v_name, v_group_id, v_operation, SYSDATE);
END;

TRUNCATE TABLE STUDENTS ;
TRUNCATE TABLE STUDENTS_LOG ;

INSERT INTO STUDENTS (NAME, GROUP_ID) VALUES ('Dima', 1);
INSERT INTO STUDENTS (NAME, GROUP_ID) VALUES ('Sasha', 1);
INSERT INTO STUDENTS (NAME, GROUP_ID) VALUES ('Masha', 2);

UPDATE STUDENTS SET NAME = 'Alex' WHERE ID = 2;

DELETE FROM STUDENTS WHERE ID = 2;

-- Процедура для восстановления информации на указанный временной момент

CREATE OR REPLACE PROCEDURE restore_students(p_date DATE)
AS
    v_student_id NUMBER;
    v_name VARCHAR2(100);
    v_group_id NUMBER;
    v_operation VARCHAR2(10);
BEGIN
    FOR v_log IN (SELECT * FROM STUDENTS_LOG WHERE LOG_DATE <= p_date ORDER BY LOG_DATE ASC) LOOP
        v_student_id := v_log.STUDENT_ID;
        v_name := v_log.NAME;
        v_group_id := v_log.GROUP_ID;
        v_operation := v_log.OPERATION;
        
        IF v_operation = 'INSERT' THEN
            INSERT INTO STUDENTS (ID, NAME, GROUP_ID)
            VALUES (v_student_id, v_name, v_group_id);
        ELSIF v_operation = 'UPDATE' THEN
            UPDATE STUDENTS
            SET NAME = v_name,
                GROUP_ID = v_group_id
            WHERE ID = v_student_id;
        ELSIF v_operation = 'DELETE' THEN
            DELETE FROM STUDENTS
            WHERE ID = v_student_id;
        END IF;
    END LOOP;
END;

BEGIN
    restore_students(TO_DATE('2024-03-15 13:30:00', 'YYYY-MM-DD HH24:MI:SS'));
END;

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

INSERT INTO STUDENTS s (name, group_id) VALUES ('dima_test', 1);