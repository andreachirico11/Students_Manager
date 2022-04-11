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
      isWithRec: true,
      receiptPrice: null,
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
          number: 1111,
          amount: 13,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_3',
          number: 1111,
          amount: 14,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
      ],
      isWithRec: true,
      receiptPrice: null,
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
      isWithRec: true,
      parent: {
        name: 'Mauro',
        surname: 'Mauri',
        fiscalCode: 'abc',
        address: 'hasfkljahfashbasolfasd',
        phoneNumber: 3453456656,
      },
      address: 'via gianni gianno',
      receiptPrice: null,

      notes:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis delectus quod, rerum velit natus ullam quam? Quisquam qui sint voluptatibus ut, velit laboriosam fuga iste omnis in provident accusamus odit, magnam molestias tempora aspernatur minima, reprehenderit a est? Fugit, similique?',
      receipts: [
        {
          id: 'r_1',
          number: 1111,
          amount: 1,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_2',
          number: 1111,
          amount: 2,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_3',
          number: 1111,
          amount: 3,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_4',
          number: 1111,
          amount: 4,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_5',
          number: 1111,
          amount: 5,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_6',
          number: 1111,
          amount: 6,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_7',
          number: 1111,
          amount: 7,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_1',
          number: 1111,
          amount: 8,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_1',
          number: 1111,
          amount: 9,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_1',
          number: 1111,
          amount: 10,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
        },
        {
          id: 'r_1',
          number: 1111,
          amount: 11,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'atm',
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
    'Name ' + i,
    'Surname ' + i,
    getParent(i),
    getFakeReceipts(),
    true,
    new Date(),
    getRand(20),
    getLongString(12),
    getRand(10) + getLongString(1),
    addr,
    getLongString(40),
    null,
    's_' + randomId()
  );
}

function getParent(i: number): Parent {
  return new Parent(
    'P name' + i,
    'P surname' + i,
    getRand(1000000),
    getLongString(12),
    getLongString(40)
  );
}

export function getFakeReceipts(): Receipt[] {
  const num = getRand(30) + 10,
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
    getRand(30),
    generateRandomDOB(),
    getRand(300),
    i % 2 === 0 ? 'money' : i % 3 === 0 ? 'transfer' : 'atm',
    new Date(),
    'r_' + randomId()
  );
}

function randomId() {
  return (
    getLongString(2) + getRand(2) + getLongString(2) + getRand(2) + getLongString(2) + getRand(2)
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

function generateRandomDOB(): Date {
  return getRandomDate(new Date('2000-02-12T01:57:45.271Z'), new Date());
}

function getRandomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}
