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
/