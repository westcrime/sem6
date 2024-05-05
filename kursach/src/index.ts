import Table from './Table';
import NumberType from './basic_types/NumberType';
import StringType from './basic_types/StringType';
import BooleanType from './basic_types/BooleanType';
import ForeignKeyType from './basic_types/ForeignKeyType';

class Group extends Table {
    public id: NumberType = new NumberType(0, true);
    public name: StringType = new StringType(256, 'NoName', false, true);
}

class Student extends Table {
    public id: NumberType = new NumberType(0, true);
    public name: StringType = new StringType(256, 'NoName', false, true);
    public groupId: ForeignKeyType<typeof Group> = new ForeignKeyType<typeof Group>(Group, 'id', 'Cascade');
}

async function main() {
    const studentData: {[key: string]: any} = {
        id: 1,
        name: 'John',
        groupId: 1
    };
    
    const student = new Student();
    await student.connect();
    student.save(studentData);
}

main().catch(console.error);