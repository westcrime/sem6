-- Процедура для восстановления информации на указанный временной момент

CREATE OR REPLACE PROCEDURE restore_students(p_date DATE)
AS
BEGIN
    EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_id_unique DISABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_name_unique DISABLE';
    
    DELETE FROM STUDENTS;
    
    FOR v_log IN (SELECT * FROM STUDENTS_LOG WHERE LOG_DATE <= p_date ORDER BY LOG_DATE ASC) LOOP
        IF v_log.OPERATION = 'INSERT' THEN
            INSERT INTO STUDENTS (ID, NAME, GROUP_ID)
            VALUES (v_log.STUDENT_ID, v_log.NAME, v_log.GROUP_ID);
        ELSIF v_log.OPERATION = 'UPDATE' THEN
            DECLARE
                v_count NUMBER;
            BEGIN
                SELECT COUNT(*) INTO v_count FROM STUDENTS WHERE ID = v_log.STUDENT_ID;
                IF v_count > 0 THEN
                    UPDATE STUDENTS
                    SET NAME = v_log.NAME,
                        GROUP_ID = v_log.GROUP_ID
                    WHERE ID = v_log.STUDENT_ID;
                ELSE
                    INSERT INTO STUDENTS (ID, NAME, GROUP_ID)
                    VALUES (v_log.STUDENT_ID, v_log.NAME, v_log.GROUP_ID);
                END IF;
            END;
        ELSIF v_log.OPERATION = 'DELETE' THEN
            NULL;
        END IF;
    END LOOP;
    
    EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_id_unique ENABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_name_unique ENABLE';
    
EXCEPTION
    WHEN OTHERS THEN
        EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_id_unique ENABLE';
        EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_name_unique ENABLE';
        RAISE;
END;
/