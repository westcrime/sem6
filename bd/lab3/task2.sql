

create or replace function compare_objects(first_name varchar2, first_type varchar2, first_schema varchar2, second_name varchar2, second_type varchar2, second_schema varchar2) return number
as
begin
	if first_name is null or first_type is null or second_name is null or second_type is null then
		return 1;
    end if;
	return dbms_lob.compare(dbms_metadata.get_ddl(first_type, first_name, first_schema), replace(replace(dbms_metadata.get_ddl(second_type, second_name, second_schema), second_schema, first_schema), LOWER(second_schema), LOWER(first_schema)));
end;
/
create or replace function compare_schema_functions_procedures_packages(dev_schema_name varchar2, prod_schema_name varchar2) return object_name_data_format
as
    function_source varchar2(32) := 'FUNCTION';
    package_source varchar2(32) := 'PACKAGE';
    package_source varchar2(32) := 'PACKAGE';
    prod_object_names object_name_data_format;
	dev_object_names object_name_data_format;
    dev_object_dependencies object_name_data_format;
    dev_object_types object_name_data_format;
	sorted_dev_object_names object_name_data_format := object_name_data_format();
	i number;
	tmp_object_name varchar2(128);
	current_sorted_dev_object_names_size number;
	can_be_removed boolean;
	still_can_be_removed boolean;
	fk_looped constant number := -20001;
	fk_looped_message constant varchar(64) := 'Object references are looped!';
begin
    select distinct t.name as t_name, g.name as g_name, t.type as t_type, d.referenced_name as ref bulk collect into dev_object_names, prod_object_names, dev_object_types, dev_object_dependencies from sys.all_source t 
		full outer join sys.all_source g on g.owner = prod_schema_name and t.owner = dev_schema_name and g.name = t.name
        left join sys.all_dependencies d on d.referenced_owner = t.owner and d.name = t.name
        left join sys.all_source s on s.name = t.name and compare_objects(g.name, g.type, prod_schema_name, t.name, t.type, dev_schema_name) = 0
        where s.name is null and t.owner = dev_schema_name;

    loop 
		current_sorted_dev_object_names_size := sorted_dev_object_names.count();
		still_can_be_removed := false;

		i := 1;
		while i <= dev_object_names.count()
		loop
			tmp_object_name := dev_object_names(i);

			if tmp_object_name is not null then
				can_be_removed := not tmp_object_name member of sorted_dev_object_names;

				if can_be_removed then
					still_can_be_removed := true;
				end if;

				while i <= dev_object_names.count() and dev_object_names(i) = tmp_object_name
				loop
					if can_be_removed and dev_object_dependencies(i) member of dev_object_names and not dev_object_dependencies(i) member of sorted_dev_object_names then
						can_be_removed := false;
					end if;
					i := i + 1;
				end loop;

				if can_be_removed then
					sorted_dev_object_names.extend;
					sorted_dev_object_names(sorted_dev_object_names.count()) := tmp_object_name;
				end if;
			else
				i := i + 1;
			end if;
		end loop;

		if current_sorted_dev_object_names_size = sorted_dev_object_names.count() then
			if still_can_be_removed then
				raise_application_error(fk_looped, fk_looped_message);
			end if;
			exit;
		end if;
	end loop;

	return dev_object_names;
end;
/
create or replace function compare_schema_indexes(dev_schema_name varchar2, prod_schema_name varchar2) return object_name_data_format
as
    package_source varchar2(32) := 'INDEX';
    prod_index_names object_name_data_format;
	dev_index_names object_name_data_format;
begin
    select distinct t.index_name as t_name, g.index_name as g_name bulk collect into dev_index_names, prod_index_names from sys.all_indexes t 
		full outer join sys.all_indexes g on g.owner = prod_schema_name and t.owner = dev_schema_name and g.index_name = t.index_name
        left join sys.all_ind_columns e on t.owner = e.index_owner and e.table_name = t.table_name and e.index_name = t.index_name
        left join sys.all_ind_columns f on f.index_owner = g.owner and f.table_name = g.table_name and f.index_name = g.index_name
			and f.column_name = e.column_name
        where t.owner = dev_schema_name and f.table_name is null;
		
	return dev_index_names;
end;
/