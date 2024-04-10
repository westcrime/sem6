create table dev.test1 (
    id number,
    constraint id1_unique unique (id)
);
create table dev.test2 (
    id number,
    constraint id2_unique unique (id)
);
create table dev.test3 (
    id number,
    constraint id3_unique unique (id)
);
create table dev.test4 (
    id number,
    id_test1 number,
    constraint id4_unique unique (id),
    constraint test1_fk foreign key (id_test1) references  dev.test1(id) on delete set null
);
create table dev.test5 (
    id number,
    id_test2 number,
    constraint id5_unique unique (id),
    constraint test2_fk foreign key (id_test2) references  dev.test2(id) on delete set null
);
create table dev.test6 (
    id number,
    id_test4 number,
    id_test5 number,
    constraint id6_unique unique (id),
    constraint test4_fk foreign key (id_test4) references  dev.test4(id) on delete set null,
    constraint test5_fk foreign key (id_test5) references  dev.test5(id) on delete set null
);
create table prod.test1 (
    id number,
    constraint id1_unique unique (id)
);
create table prod.test2 (
    idd number,
    constraint id2_unique unique (idd)
);
create table prod.test4 (
    id number,
    id_test1 number,
    constraint id4_unique unique (id),
    constraint test1_fk foreign key (id_test1) references  prod.test1(id) on delete set null
);
create table prod.test7 (
    id number,
    id_test1 number,
    constraint id7_unique unique (id),
    constraint test1_fk_2 foreign key (id_test1) references  prod.test1(id) on delete set null
);
create or replace function prod.func1(id number) return number
as
begin
    if id < 1 then
        return id;
    end if;
    return id + prod.func1(id - 1);
end;
/
create or replace function prod.func2(id number) return number
as
begin
    if id < 1 then
        return id;
    end if;
    return id + prod.func1(id - 1);
end;
/
create or replace function dev.func2(id number) return number
as
begin
    if id < 1 then
        return id;
    end if;
    return id + dev.func2(id - 1);
end;
/
create or replace function dev.func3(id number) return number
as
begin
    if id < 1 then
        return id;
    end if;
    return id + dev.func2(id - 1);
end;
/
create index dev.ind1 on dev.test5(id_test2);
create index dev.ind2 on dev.test4(id_test1);
create index prod.ind2 on prod.test4(id_test1);
create index prod.ind3 on prod.test7(id_test1);