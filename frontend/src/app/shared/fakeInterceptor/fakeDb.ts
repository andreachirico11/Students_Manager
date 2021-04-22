import { IUser } from '../models/IUser';
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
      notes: 'deve morire',
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
      notes: 'deve morire',
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
      notes: 'deve morire',
      receipts: [
        {
          id: 'r_1',
          number: 'asdfsadf',
          amount: 12,
          emissionDate: new Date(),
          paymentDate: new Date(),
          typeOfPayment: 'Bancomat',
        },
      ],
    },
  ],
};