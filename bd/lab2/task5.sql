-- Процедура для восстановления информации на указанный временной момент

CREATE OR REPLACE PROCEDURE restore_students(p_date DATE)
AS
BEGIN
    EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_id_unique DISABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_name_unique DISABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER students_audit DISABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER students_fk DISABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER students_group_id_foreign_key_trigger DISABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER update_groups_cval DISABLE';
    
    -- Откатываем изменения после указанной даты
    FOR v_log IN (SELECT * FROM STUDENTS_LOG WHERE LOG_DATE > p_date ORDER BY LOG_DATE DESC) LOOP
        IF v_log.OPERATION = 'DELETE' THEN
        -- Вставляем запись обратно, так как она была удалена после p_date
        INSERT INTO STUDENTS (ID, NAME, GROUP_ID)
        VALUES (v_log.STUDENT_ID, v_log.NEW_NAME, v_log.NEW_GROUP_ID);
        ELSIF v_log.OPERATION = 'INSERT' THEN
        -- Удаляем запись, так как она была вставлена после p_date
        DELETE FROM STUDENTS WHERE ID = v_log.STUDENT_ID;
        ELSIF v_log.OPERATION = 'UPDATE' THEN
        -- Возвращаем старые значения, так как запись была обновлена после p_date
        UPDATE STUDENTS
        SET NAME = v_log.OLD_NAME,
            GROUP_ID = v_log.OLD_GROUP_ID
        WHERE ID = v_log.STUDENT_ID;
        END IF;
        DELETE FROM STUDENTS_LOG WHERE LOG_ID = v_log.LOG_ID;
    END LOOP;
    
    EXECUTE IMMEDIATE 'ALTER TRIGGER students_audit ENABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_id_unique ENABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_name_unique ENABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER students_fk ENABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER students_group_id_foreign_key_trigger ENABLE';
    EXECUTE IMMEDIATE 'ALTER TRIGGER update_groups_cval ENABLE';
    
EXCEPTION
    WHEN OTHERS THEN
        EXECUTE IMMEDIATE 'ALTER TRIGGER students_audit ENABLE';
        EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_id_unique ENABLE';
        EXECUTE IMMEDIATE 'ALTER TRIGGER check_students_name_unique ENABLE';
        EXECUTE IMMEDIATE 'ALTER TRIGGER students_fk ENABLE';
        EXECUTE IMMEDIATE 'ALTER TRIGGER students_group_id_foreign_key_trigger ENABLE';
        EXECUTE IMMEDIATE 'ALTER TRIGGER update_groups_cval ENABLE';
        RAISE;
END;
/