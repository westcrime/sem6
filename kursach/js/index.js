import Table from './Table.js';
import NumberType from './basic_types/NumberType.js';
import StringType from './basic_types/StringType.js';
import ForeignKeyType from './basic_types/ForeignKeyType.js';
import Pointer from './Pointer.js';

class Group extends Table {
    id = new NumberType(0, true, true);
    name = new StringType(256, 'NoName', false, true);
    car = new ForeignKeyType('Car', 'id', 'Cascade');
}

class Car extends Table {
    id = new NumberType(0, true, true);
    name = new StringType(256, 'NoName', false, true);
}

class Student extends Table {
    id = new NumberType(0, true, true);
    name = new StringType(256, 'NoName', false, true);
    groupId = new ForeignKeyType('Group', 'id', 'Cascade');
}

async function main() {
    const studentData = {
        id: 1,
        name: 'John',
        groupId: 1,
    };
    const groupData = {
        id: 1,
        name: '153502',
        car: 1,
    };
    const carData = {
        id: 1,
        name: 'BMW'
    };
    const student = new Student();
    const group = new Group();
    const car = new Car();
    await student.deleteTable();
    await group.deleteTable();
    await car.deleteTable();
    await car.createTable();
    await group.createTable();
    await student.createTable();
    const pointer = new Pointer();
    await pointer.connect('Car');
    await pointer.save(carData);
    await pointer.connect('Group');
    await pointer.save(groupData);
    await pointer.connect('Student');
    await pointer.save(studentData);
    await pointer.connect('Car');
    await pointer.delete(1);
}

main().catch(console.error);
