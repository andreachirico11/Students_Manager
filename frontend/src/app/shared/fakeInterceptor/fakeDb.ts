import { IUser } from '../models/IUser';
import { Parent } from '../models/Parent';
import { Receipt } from '../models/Receipts';
import { Student } from '../models/Student';

export let FAKE_DB: { user: IUser[]; students: Student[] } = {
  user: [
    {
      id: '1',
      email: 'admin@email',
      password: 'admin',
      name: 'Gianni',
    },
  ],
  students: [
    {
      id: 's_1',
      name: 'Gianni',
      surname: 'Gianno',
      schoolClass: '1b',
      dateOfBirth: new Date(),
      fiscalCode: 'abcr',
      phoneNumber: 1,
      parent: {
        name: 'Mauro',
        surname: 'Mauri',
        fiscalCode: 'abc',
        address: 'hasfkljahfashbasolfasd',
        phoneNumber: 3453456656,
      },
      address: 'via gianni gianno',
      notes:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis delectus quod, rerum velit natus ullam quam? Quisquam qui sint voluptatibus ut, velit laboriosam fuga iste omnis in provident accusamus odit, magnam molestias tempora aspernatur minima, reprehenderit a est? Fugit, similique?',
      receipts: [],
    },
    {
      id: 's_2',
      name: 'Giannino',
      surname: 'Giannoni',
      schoolClass: '1b',
      dateOfBirth: new Date(),
      fiscalCode: 'abcr',
      phoneNumber: 1,
      parent: {
        name: 'Mauro',
        surname: 'Mauri',
        fiscalCode: 'abc',
        address: 'hasfkljahfashbasolfasd',
        phoneNumber: 3453456656,
      },
      notes:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis delectus quod, rerum velit natus ullam quam? Quisquam qui sint voluptatibus ut, velit laboriosam fuga iste omnis in provident accusamus odit, magnam molestias tempora aspernatur minima, reprehenderit a est? Fugit, similique?',
      receipts: [
        {
          id: 'r_2',
          number: 'asdfsadf',
          amount: 13,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bonifico',
        },
        {
          id: 'r_3',
          number: 'asdfsadf',
          amount: 14,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Moneta',
        },
      ],
      address: 'via gianni gianno',
    },
    {
      id: 's_3',
      name: 'ianni',
      surname: 'ianno',
      schoolClass: '1b',
      dateOfBirth: new Date(),
      fiscalCode: 'abcr',
      phoneNumber: 1,
      parent: {
        name: 'Mauro',
        surname: 'Mauri',
        fiscalCode: 'abc',
        address: 'hasfkljahfashbasolfasd',
        phoneNumber: 3453456656,
      },
      address: 'via gianni gianno',

      notes:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis delectus quod, rerum velit natus ullam quam? Quisquam qui sint voluptatibus ut, velit laboriosam fuga iste omnis in provident accusamus odit, magnam molestias tempora aspernatur minima, reprehenderit a est? Fugit, similique?',
      receipts: [
        {
          id: 'r_1',
          number: 'asdfsadf',
          amount: 1,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_2',
          number: 'asdfsadf',
          amount: 2,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_3',
          number: 'asdfsadf',
          amount: 3,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_4',
          number: 'asdfsadf',
          amount: 4,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_5',
          number: 'asdfsadf',
          amount: 5,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_6',
          number: 'asdfsadf',
          amount: 6,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_7',
          number: 'asdfsadf',
          amount: 7,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_1',
          number: 'asdfsadf',
          amount: 8,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_1',
          number: 'asdfsadf',
          amount: 9,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_1',
          number: 'asdfsadf',
          amount: 10,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
        {
          id: 'r_1',
          number: 'asdfsadf',
          amount: 11,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
      ],
    },
  ],
};

(function initDB() {
  FAKE_DB.students = [];
  FAKE_DB.students = getFakeStudents();
})();

export function getFakeStudents(): Student[] {
  const num = getRand(50) + 5,
    students = [];
  let i = 0;
  while (i < num) {
    students.push(getStudent(i));
    i++;
  }
  return students;
}

function getStudent(i: number): Student {
  const addr = i % 3 === 0 ? null : `Via ${getLongString(5)} ${getLongString(5)} ${getRand(50)}`;
  return new Student(
    'Name_' + i,
    'Surname_' + i,
    getRand(10) + getLongString(1),
    new Date(),
    getLongString(12),
    getRand(20),
    getParent(i),
    getFakeReceipts(),
    addr,
    getLongString(40),
    's_' + i
  );
}

function getParent(i: number): Parent {
  return new Parent(
    'P_name' + i,
    'P_surname' + i,
    getLongString(12),
    getLongString(40),
    getRand(1000000)
  );
}

export function getFakeReceipts(): Receipt[] {
  const num = getRand(15) + 1,
    receipts = [];
  let i = 0;
  while (i < num) {
    receipts.push(getReceipt(i));
    i++;
  }
  return receipts;
}

function getReceipt(i: number): Receipt {
  return new Receipt(
    getRand(300) + '',
    getRand(30),
    new Date(),
    i % 2 === 0 ? 'Bancomat' : i % 3 === 0 ? 'Bonifico' : 'Moneta',
    new Date(),
    'r_' + i
  );
}

function getLongString(length: number) {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}

function getRand(interval: number) {
  return Math.floor(Math.random() * interval) + 1;
}
