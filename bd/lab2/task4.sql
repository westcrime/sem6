-- Таблица журнала

CREATE TABLE STUDENTS_LOG (
    LOG_ID NUMBER PRIMARY KEY,
	STUDENT_ID NUMBER,
    OLD_NAME VARCHAR2(100),
    NEW_NAME VARCHAR2(100),
    OLD_GROUP_ID NUMBER,
    NEW_GROUP_ID NUMBER,
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
    v_old_name VARCHAR2(100);
    v_new_name VARCHAR2(100);
    v_old_group_id NUMBER;
    v_new_group_id NUMBER;
BEGIN
    IF INSERTING THEN
        v_operation := 'INSERT';
        v_id := :NEW.ID;
        v_new_name := :NEW.NAME;
        v_new_group_id := :NEW.GROUP_ID;
    ELSIF UPDATING THEN
        v_operation := 'UPDATE';
        v_id := :OLD.ID;
        v_old_name := :OLD.NAME;
        v_new_name := :NEW.NAME;
        v_old_group_id := :OLD.GROUP_ID;
        v_new_group_id := :NEW.GROUP_ID;
    ELSE
        v_operation := 'DELETE';
        v_id := :OLD.ID;
        v_old_name := :OLD.NAME;
        v_old_group_id := :OLD.GROUP_ID;
    END IF;

    INSERT INTO STUDENTS_LOG (LOG_ID, STUDENT_ID, OLD_NAME, NEW_NAME, OLD_GROUP_ID, NEW_GROUP_ID, OPERATION, LOG_DATE)
    VALUES (log_id_seq.NEXTVAL, v_id, v_old_name, v_new_name, v_old_group_id, v_new_group_id, v_operation, SYSDATE);
END;
/