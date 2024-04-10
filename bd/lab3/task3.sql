create or replace function compare_schema_tables_alter(dev_schema_name varchar2, prod_schema_name varchar2) return varchar2
as
    reference_constraint_type constant varchar2(4) := 'R';
	dev_table_names object_name_data_format;
	prod_table_names object_name_data_format;
	referenced_table_names object_name_data_format;
	sorted_dev_table_names object_name_data_format := object_name_data_format();
	filtered_prod_table_names object_name_data_format;
	filtered_dev_table_names object_name_data_format;
    result varchar2(10000) := '';
	i number;
	tmp_table_name varchar2(128);
	current_sorted_dev_table_names_size number;
	can_be_removed boolean;
	still_can_be_removed boolean;
	fk_looped constant number := -20001;
	fk_looped_message constant varchar(64) := 'Foreign keys are looped!';
    object_type varchar2(32) := 'TABLE';
	cnt number;
begin
	dbms_metadata.set_transform_param(dbms_metadata.session_transform, 'SQLTERMINATOR', true);

    select distinct t.table_name as t_name, d.table_name as d_name, g.table_name as g_name bulk collect into dev_table_names, referenced_table_names, prod_table_names from sys.all_tables t 
		full outer join sys.all_tables g on g.owner = prod_schema_name and t.owner = dev_schema_name and g.table_name = t.table_name

        left join sys.all_constraints c on t.owner = c.owner and t.table_name = c.table_name
		left join sys.all_constraints h on h.owner = g.owner and h.table_name = g.table_name
			and h.constraint_name = c.constraint_name
			and h.constraint_type = c.constraint_type
		left join sys.all_constraints i on t.owner = i.owner and t.table_name = i.table_name
			and i.constraint_type = h.constraint_type
			and i.constraint_name = h.constraint_name

        left join sys.dba_tab_columns e on t.owner = e.owner and e.table_name = t.table_name
        left join sys.dba_tab_columns f on f.owner = g.owner and f.table_name = g.table_name
			and f.column_name = e.column_name
			and f.data_type = e.data_type
		left join sys.dba_tab_columns j on t.owner = j.owner and j.table_name = t.table_name
			and j.column_name = f.column_name
			and j.data_type = f.data_type

        left join sys.all_constraints d on t.owner = d.owner and c.r_constraint_name = d.constraint_name and c.constraint_type = reference_constraint_type
        where (t.owner = dev_schema_name or g.owner = prod_schema_name) and (f.table_name is null or h.table_name is null or i.table_name is null or j.table_name is null)
		order by t.table_name;

	loop 
		current_sorted_dev_table_names_size := sorted_dev_table_names.count();
		still_can_be_removed := false;

		i := 1;
		while i <= dev_table_names.count()
		loop
			tmp_table_name := dev_table_names(i);

			if tmp_table_name is not null then
				can_be_removed := not tmp_table_name member of sorted_dev_table_names;

				if can_be_removed then
					still_can_be_removed := true;
				end if;

				while i <= dev_table_names.count() and dev_table_names(i) = tmp_table_name
				loop
					if can_be_removed and referenced_table_names(i) member of dev_table_names and not referenced_table_names(i) member of sorted_dev_table_names then
						can_be_removed := false;
					end if;
					i := i + 1;
				end loop;

				if can_be_removed then
					sorted_dev_table_names.extend;
					sorted_dev_table_names(sorted_dev_table_names.count()) := tmp_table_name;
				end if;
			else
				i := i + 1;
			end if;
		end loop;

		if current_sorted_dev_table_names_size = sorted_dev_table_names.count() then
			if still_can_be_removed then
				raise_application_error(fk_looped, fk_looped_message);
			end if;
			exit;
		end if;
	end loop;

	i := 1;
	while i <= prod_table_names.count()
    loop
		tmp_table_name := prod_table_names(i);

		if tmp_table_name is not null then

			while i <= prod_table_names.count() and prod_table_names(i) = tmp_table_name
			loop
				i := i + 1;
			end loop;

			if not tmp_table_name member of sorted_dev_table_names then
				result := result || 'drop table ' || prod_schema_name || '.' || tmp_table_name || ' cascade constraints;' || chr(10);
			end if;
		else
			i := i + 1;
		end if;
    end loop;

    for j in 1..sorted_dev_table_names.count()
    loop
		if sorted_dev_table_names(j) is not null then
			i := 1;
			while i <= prod_table_names.count()
			loop
				if prod_table_names(i) is not null and sorted_dev_table_names(j) = prod_table_names(i) then
					result := result || replace(dbms_metadata_diff.compare_alter(object_type, sorted_dev_table_names(j), sorted_dev_table_names(j), prod_schema_name, dev_schema_name), chr(10), ';' || chr(10)) || ';';
					exit;
				end if;
				i := i + 1;
			end loop;
			if i > prod_table_names.count() then
				result := result || replace(dbms_metadata.get_ddl(object_type, sorted_dev_table_names(j), dev_schema_name), dev_schema_name, prod_schema_name) || chr(10);
			end if;
		end if;
    end loop;

	return result;
end;
/
create or replace function compare_schema_functions_procedures_packages_alter(dev_schema_name varchar2, prod_schema_name varchar2) return varchar2
as
    function_source varchar2(32) := 'FUNCTION';
    package_source varchar2(32) := 'PACKAGE';
    package_source varchar2(32) := 'PACKAGE';
    prod_object_names object_name_data_format;
	dev_object_names object_name_data_format;
    dev_object_dependencies object_name_data_format;
    dev_object_types object_name_data_format;
	prod_object_types object_name_data_format;
	sorted_dev_object_names object_name_data_format := object_name_data_format();
	i number;
	tmp_object_name varchar2(128);
	current_sorted_dev_object_names_size number;
	can_be_removed boolean;
	still_can_be_removed boolean;
	fk_looped constant number := -20001;
	fk_looped_message constant varchar(64) := 'Object references are looped!';
	result varchar2(10000) := '';
begin
    select distinct t.name as t_name, g.name as g_name, t.type as t_type, g.type as g_type, d.referenced_name as ref bulk collect into dev_object_names, prod_object_names, dev_object_types, prod_object_types, dev_object_dependencies from sys.all_source t 
		full outer join sys.all_source g on g.owner = prod_schema_name and t.owner = dev_schema_name and g.name = t.name
        left join sys.all_dependencies d on d.referenced_owner = t.owner and d.name = t.name
        left join sys.all_source s on s.name = t.name and compare_objects(g.name, g.type, prod_schema_name, t.name, t.type, dev_schema_name) = 0
        where s.name is null and (t.owner = dev_schema_name or g.owner = prod_schema_name);

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

	for i in 1..prod_object_names.count()
	loop
		if prod_object_names(i) is not null then
			result := result || 'drop ' || prod_object_types(i) || ' ' || prod_schema_name || '.' || prod_object_names(i) || ';' || chr(10);
		end if;
	end loop;

	for i in 1..sorted_dev_object_names.count()
	loop
		if sorted_dev_object_names(i) is not null then
			result := result || replace(replace(dbms_metadata.get_ddl(dev_object_types(i), sorted_dev_object_names(i), dev_schema_name), dev_schema_name, prod_schema_name), LOWER(dev_schema_name), LOWER(prod_schema_name)) || chr(10);
		end if;
	end loop;

	return result;
end;
/
create or replace function compare_schema_indexes_alter(dev_schema_name varchar2, prod_schema_name varchar2) return varchar2
as
    package_source varchar2(32) := 'INDEX';
	dev_index_names object_name_data_format;
	prod_index_names object_name_data_format;
	sorted_dev_index_names object_name_data_format;
	result varchar2(10000) := '';
	object_type varchar2(32) := 'INDEX';
	tmp_table_name varchar2(128);
begin
	dbms_metadata.set_transform_param(dbms_metadata.session_transform, 'SQLTERMINATOR', true);

    select distinct t.index_name as t_name, g.index_name as g_name bulk collect into dev_index_names, prod_index_names from sys.all_indexes t 
		full outer join sys.all_indexes g on g.owner = prod_schema_name and t.owner = dev_schema_name and g.index_name = t.index_name
        left join sys.all_ind_columns e on t.owner = e.index_owner and e.table_name = t.table_name and e.index_name = t.index_name
        left join sys.all_ind_columns f on f.index_owner = g.owner and f.table_name = g.table_name and f.index_name = g.index_name
			and f.column_name = e.column_name
		left join sys.all_ind_columns j on t.owner = j.index_owner and j.table_name = t.table_name and j.index_name = t.index_name
			and j.column_name = f.column_name
        where (t.owner = dev_schema_name or g.owner = prod_schema_name) and (f.table_name is null or j.table_name is null);
		
	for i in 1..prod_index_names.count()
	loop
		if prod_index_names(i) is not null then
			result := result || 'drop index ' || prod_schema_name || '.' || prod_index_names(i) || ';' || chr(10);
		end if;
	end loop;

	for i in 1..dev_index_names.count()
	loop
		if dev_index_names(i) is not null then
			result := result || replace(dbms_metadata.get_ddl(object_type, dev_index_names(i), dev_schema_name), dev_schema_name, prod_schema_name) || chr(10);
		end if;
	end loop;
	
	return result;
end;
/
create or replace function compare_schema_alter(dev_schema_name varchar2, prod_schema_name varchar2) return varchar2
as
	procedures_functions_packages varchar2(4000);
	tables varchar2(4000);
	ind varchar2(4000);
	result varchar2(20000);
begin
	dbms_metadata.set_transform_param(dbms_metadata.session_transform, 'SQLTERMINATOR', true);

	select compare_schema_tables_alter(dev_schema_name, prod_schema_name) into tables from dual;
	select compare_schema_indexes_alter(dev_schema_name, prod_schema_name) into ind from dual;
	select compare_schema_functions_procedures_packages_alter(dev_schema_name, prod_schema_name) into procedures_functions_packages from dual;
	
	result := tables || ind || procedures_functions_packages;
	return result;
end;
/