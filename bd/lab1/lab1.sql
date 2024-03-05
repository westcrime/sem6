CREATE TABLE MyTable (
    id NUMBER PRIMARY KEY,
    val NUMBER
);

DELETE FROM MYTABLE;

DECLARE 
    v_id NUMBER;
BEGIN
    FOR i IN 1..10000 LOOP
        v_id := i - 1;
        INSERT INTO MyTable(id, val) VALUES (v_id, ROUND(DBMS_RANDOM.value() * 1000));
    END LOOP;
    COMMIT;
END;

CREATE OR REPLACE FUNCTION count_odd_vals
RETURN VARCHAR2 AS
    count_val NUMBER;
BEGIN 
    SELECT COUNT(*) INTO count_val FROM MYTABLE WHERE MOD(val, 2) = 0;
    
    IF count_val > 5000 THEN
        RETURN 'TRUE';
    ELSIF count_val = 5000 THEN
        RETURN 'EQUAL';
    ELSE 
        RETURN 'FALSE';
    END IF;
END;

SELECT count_odd_vals FROM DUAL;

CREATE OR REPLACE FUNCTION get_insert_string
(id_var NUMBER)
RETURN VARCHAR2 AS
    val_var NUMBER;
	answer VARCHAR(50);
BEGIN 
	SELECT val INTO val_var FROM MYTABLE WHERE id = id_var;
    answer := 'INSERT INTO MYTABLE (id, val) VALUES (' || id_var || ', ' || val_var || ');';
   	RETURN answer;
END;

SELECT get_insert_string(239) FROM DUAL;

CREATE OR REPLACE PROCEDURE my_insert
(id_var NUMBER, val_var NUMBER)
AS
BEGIN 
	INSERT INTO MYTABLE (id, val) VALUES (id_var, val_var);
END;

CREATE OR REPLACE PROCEDURE my_remove
(id_var NUMBER)
AS
BEGIN 
	DELETE FROM MYTABLE WHERE id = id_var;
END;

CREATE OR REPLACE PROCEDURE my_update
(id_var NUMBER, val_var NUMBER)
AS
BEGIN 
	UPDATE MYTABLE
	SET val = val_var
	WHERE id = id_var;
END;

CALL my_insert(10001, 1);

CALL my_remove(10001);

CALL my_update(9999, 1);

CREATE OR REPLACE FUNCTION calculate_reward_of_the_year
(month_salary NUMBER, percentage_of_annual_bonuses NUMBER)
RETURN NUMBER AS
BEGIN 
	IF month_salary <= 0 THEN 
		RAISE_APPLICATION_ERROR(-20001, 'Месячная зарплата должна быть положительной');
	END IF;
	IF percentage_of_annual_bonuses <= 0 THEN 
		RAISE_APPLICATION_ERROR(-20002, 'Процент премий должен быть положительным');
	END IF;
	RETURN (1 + percentage_of_annual_bonuses * 0.01) * 12 * month_salary;
END;

DECLARE
    annual_reward NUMBER;
BEGIN
    annual_reward := calculate_reward_of_the_year(-5000, 10);
    DBMS_OUTPUT.PUT_LINE('Общее вознаграждение за год: ' || annual_reward);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ошибка: ' || SQLERRM);
END;