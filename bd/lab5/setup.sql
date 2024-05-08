insert into groups values (0, '153502', 2);
exec dbms_lock.sleep(0.1);
insert into groups values (1, '153501', 3);
exec dbms_lock.sleep(0.1);

insert into students values(1, 'Student1', 0);
exec dbms_lock.sleep(0.1);
insert into students values(2, 'Student2', 0);
exec dbms_lock.sleep(0.1);
insert into students values(3, 'Student3', 1);
exec dbms_lock.sleep(0.1);
insert into students values(4, 'Student4', 1);
exec dbms_lock.sleep(0.1);
insert into students values(5, 'Student5', 1);
exec dbms_lock.sleep(0.1);

insert into exams values (1, 'Math', LOCALTIMESTAMP, 0);
exec dbms_lock.sleep(0.1);
insert into exams values (2, 'Programming', LOCALTIMESTAMP, 1);
exec dbms_lock.sleep(0.1);