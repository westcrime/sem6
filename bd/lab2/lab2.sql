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

CREATE OR REPLACE TRIGGER autoINcrement_students
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
    SELECT students_seq.nextval INTO :NEW.id FROM dual;
END;

CREATE SEQUENCE groups_seq
START WITH 1
INCREMENT BY 1
NOCACHE;

CREATE OR REPLACE TRIGGER autoINcrement_groups
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

CREATE TABLE journal (
	id NUMBER GENERATED ALWAYS AS IDENTITY,
	action_name VARCHAR2(32) NOT NULL,
	table_name VARCHAR2(32) NOT NULL,
	description VARCHAR2(512) NOT NULL,
	date_AND_time TIMESTAMP WITH LOCAL TIME ZONE NOT NULL
);

-- Триггер для журналирования всех действий

CREATE OR REPLACE TRIGGER students_journaling_trigger AFTER INSERT OR UPDATE OR DELETE ON students FOR EACH ROW
DECLARE
    INSERT_str constant VARCHAR2(128) := 'INSERTed VALUES ({}) FOR columns ({}) on id ({})';
	UPDATE_str constant VARCHAR2(128) := 'UPDATEd VALUES ({}) to VALUES ({}) FOR columns ({}) on id ({})';
	DELETE_str constant VARCHAR2(128) := 'DELETEd VALUES ({}) FOR columns ({}) on id ({})';
	pattern constant varchar(16) := '\{\}';
	delimetr constant VARCHAR2(16) := ', ';
	insert_action_name constant VARCHAR2(32) := 'inserting';
	update_action_name constant VARCHAR2(32) := 'updating';
	delete_action_name constant VARCHAR2(32) := 'deleting';
	students_table_name constant VARCHAR2(32) := 'students';
	id_column_name constant VARCHAR2(32) := 'id';
	name_column_name constant VARCHAR2(32) := 'name';
	group_id_column_name constant VARCHAR2(32) := 'group_id';
	action_date_AND_time TIMESTAMP WITH LOCAL TIME ZONE;
	result_old_VALUES VARCHAR2(256);
	result_new_VALUES VARCHAR2(256);
	result_columns VARCHAR2(256);
	result_description VARCHAR2(512);
	result_action_name VARCHAR2(32);
BEGIN
	SELECT LOCALTIMESTAMP INTO action_date_AND_time FROM dual;
	CASE
		WHEN inserting THEN
			result_action_name := insert_action_name;
			result_description := INSERT_str;
			result_columns := name_column_name || delimetr || group_id_column_name;
			result_new_VALUES := :new.name || delimetr || :new.group_id;
			SELECT regexp_replace(result_description, pattern, result_new_VALUES, 1, 1) INTO result_description FROM dual;
			SELECT regexp_replace(result_description, pattern, result_columns, 1, 1) INTO result_description FROM dual;
			SELECT regexp_replace(result_description, pattern, :new.id, 1, 1) INTO result_description FROM dual;
		WHEN updating THEN
			result_action_name := update_action_name;
			result_description := UPDATE_str;
			IF :old.id != :new.id THEN
				result_columns := result_columns || id_column_name || delimetr;
				result_new_VALUES := result_new_VALUES || :new.id || delimetr;
				result_old_VALUES := result_old_VALUES || :old.id || delimetr;
			END IF;
			IF :old.name != :new.name THEN
				result_columns := result_columns || name_column_name || delimetr;
				result_new_VALUES := result_new_VALUES || :new.name || delimetr;
				result_old_VALUES := result_old_VALUES || :old.name || delimetr;
			END IF;
			IF :old.group_id != :new.group_id THEN
				result_columns := result_columns || group_id_column_name || delimetr;
				result_new_VALUES := result_new_VALUES || :new.group_id || delimetr;
				result_old_VALUES := result_old_VALUES || :old.group_id || delimetr;
			END IF;
			SELECT regexp_replace(result_description, pattern, result_old_VALUES, 1, 1) INTO result_description FROM dual;
			SELECT regexp_replace(result_description, pattern, result_new_VALUES, 1, 1) INTO result_description FROM dual;
			SELECT regexp_replace(result_description, pattern, result_columns, 1, 1) INTO result_description FROM dual;
			SELECT regexp_replace(result_description, pattern, :old.id, 1, 1) INTO result_description FROM dual;
		WHEN deleting THEN
			result_action_name := delete_action_name;
			result_description := DELETE_str;
			result_columns := name_column_name || delimetr || group_id_column_name;
			result_old_VALUES := :old.name || delimetr || :old.group_id;
			SELECT regexp_replace(result_description, pattern, result_old_VALUES, 1, 1) INTO result_description FROM dual;
			SELECT regexp_replace(result_description, pattern, result_columns, 1, 1) INTO result_description FROM dual;
			SELECT regexp_replace(result_description, pattern, :old.id, 1, 1) INTO result_description FROM dual;
	END CASE;
	INSERT INTO journal (
		action_name, 
		table_name,
		description,
		date_AND_time
	) VALUES (
		result_action_name,
		students_table_name,
		result_description,
		action_date_AND_time
	);
END;

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

CREATE OR REPLACE PROCEDURE restore_students_n_hours_ago(p_hours_back NUMBER)
AS
    v_student_id NUMBER;
    v_name VARCHAR2(100);
    v_group_id NUMBER;
    v_operation VARCHAR2(10);
    v_date DATE;
BEGIN
    v_date := SYSDATE - INTERVAL '1' HOUR * p_hours_back;

    FOR v_log IN (SELECT * FROM STUDENTS_LOG WHERE LOG_DATE <= v_date ORDER BY LOG_DATE ASC) LOOP
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
    restore_students_n_hours_ago(0);
END;

-- Триггер для обновления информации C_VAL при изменении данных в таблице STUDENTS

CREATE OR REPLACE TRIGGER UPDATE_groups_cval
AFTER INSERT OR UPDATE OR DELETE ON students
FOR EACH ROW
BEGIN
    UPDATE groups g
    SET g.c_val = (SELECT COUNT(*) FROM students s WHERE s.group_id = :NEW.group_id)
    WHERE g.id = :NEW.group_id;
END;

INSERT INTO STUDENTS s (name, group_id) VALUES ('dima', 1);