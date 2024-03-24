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