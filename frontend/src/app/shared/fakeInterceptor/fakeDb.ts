import { IUser } from '../models/IUser';
import { Parent } from '../models/Parent';
import { PaymentType } from '../models/PaymentType';
import { Receipt } from '../models/Receipts';
import { Student } from '../models/Student';

export const FAKE_DB: { user: IUser[]; students: Student[] } = {
  user: [
    {
      id: '1',
      email: 'gianni@email',
      password: '1234',
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
      address: 'via gianni gianno',
      parents: [
        {
          name: 'Mauro',
          surname: 'Mauri',
          dateOfBirth: new Date(),
          fiscalCode: 'abc',
        },
      ],
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
      address: 'via gianni gianno',
      parents: [
        {
          name: 'Mauro',
          surname: 'Mauri',
          dateOfBirth: new Date(),
          fiscalCode: 'abc',
        },
      ],
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
    },
    {
      id: 's_3',
      name: 'ianni',
      surname: 'ianno',
      schoolClass: '1b',
      dateOfBirth: new Date(),
      fiscalCode: 'abcr',
      address: 'via gianni gianno',
      parents: [
        {
          name: 'Mauro',
          surname: 'Mauri',
          dateOfBirth: new Date(),
          fiscalCode: 'abc',
        },
        {
          name: 'Maura',
          surname: 'Mauri',
          dateOfBirth: new Date(),
          fiscalCode: 'abc',
        },
      ],
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
  const num = getRand(20),
    students = [];
  let i = 0;
  while (i < num) {
    students.push(getStudent(i));
    i++;
  }
  return students;
}

function getStudent(i: number): Student {
  return new Student(
    'Name_' + i,
    'Surname_' + i,
    getRand(10) + getLongString(1),
    new Date(),
    getLongString(12),
    `Via ${getLongString(5)} ${getLongString(5)} ${getRand(50)}`,
    getParents(),
    getFakeReceipts(),
    getLongString(40),
    's_' + i
  );
}

function getParents(): Parent[] {
  const num = getRand(5),
    Parents = [];
  let i = 0;
  while (i < num) {
    Parents.push(getParent(i));
    i++;
  }
  return Parents;
}

function getParent(i: number): Parent {
  return new Parent('P_name' + i, 'P_surname' + i, new Date(), getLongString(12));
}

export function getFakeReceipts(): Receipt[] {
  const num = getRand(15),
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
    new Date(),
    i % 2 === 0 ? 'Bancomat' : i % 3 === 0 ? 'Bonifico' : 'Moneta',
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
