begin
	dbms_metadata.set_transform_param(dbms_metadata.session_transform, 'SQLTERMINATOR', true);
end;
/

create or replace type object_name_data_format as table of varchar2(128);
/
create or replace function compare_schema_tables(dev_schema_name varchar2, prod_schema_name varchar2) return object_name_data_format
as
    reference_constraint_type constant varchar2(4) := 'R';
	dev_table_names object_name_data_format;
	prod_table_names object_name_data_format;
	referenced_table_names object_name_data_format;
	sorted_dev_table_names object_name_data_format := object_name_data_format();
	i number;
	tmp_table_name varchar2(128);
	current_sorted_dev_table_names_size number;
	can_be_removed boolean;
	still_can_be_removed boolean;
	fk_looped constant number := -20001;
	fk_looped_message constant varchar(64) := 'Foreign keys are looped!';
begin
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

	return sorted_dev_table_names;
end;
/