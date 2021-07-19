import { TestBed } from '@angular/core/testing';
import { Student } from 'src/app/shared/models/Student';

import { SortService } from './sort.service';

describe('SortService', () => {
  let service: SortService;
  const fakeStudentsDb = [
    new Student(
      'giannino',
      'carlino',
      '',
      new Date(),
      1,
      {
        name: 'a',
        surname: 'b',
        fiscalCode: 'aaaaaa',
        address: 'asdfjhalfbanflasdbfasf',
        phoneNumber: 1111111111111111111,
      },

      [],
      '',
      '',
      '',
      '1'
    ),
    new Student(
      'gianni',
      'carli',
      '',
      new Date(),
      1,
      {
        name: 'a',
        surname: 'b',
        fiscalCode: 'aaaaaa',
        address: 'asdfjhalfbanflasdbfasf',
        phoneNumber: 1111111111111111111,
      },

      [],
      '',
      '',
      '',
      '1'
    ),
    new Student(
      'alberto',
      'abeti',
      '',
      new Date(),
      1,
      {
        name: 'a',
        surname: 'b',
        fiscalCode: 'aaaaaa',
        address: 'asdfjhalfbanflasdbfasf',
        phoneNumber: 1111111111111111111,
      },

      [],
      '',
      '',
      '',
      '1'
    ),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sort an array of students by name', () => {
    const result: Student[] = service.sortStudents(fakeStudentsDb, 'name', 'ascending');
    expect(result[0].name).toEqual(fakeStudentsDb[2].name);
    expect(result[1].name).toEqual(fakeStudentsDb[1].name);
    expect(result[2].name).toEqual(fakeStudentsDb[0].name);
  });

  it('should sort an array of students by surname', () => {
    const result: Student[] = service.sortStudents(fakeStudentsDb, 'surname', 'ascending');
    expect(result[0].name).toEqual(fakeStudentsDb[2].name);
    expect(result[1].name).toEqual(fakeStudentsDb[1].name);
    expect(result[2].name).toEqual(fakeStudentsDb[0].name);
  });

  it('should sort an array of students by name descending', () => {
    const result: Student[] = service.sortStudents(fakeStudentsDb, 'name', 'descending');
    expect(result[0].name).toEqual(fakeStudentsDb[0].name);
    expect(result[1].name).toEqual(fakeStudentsDb[1].name);
    expect(result[2].name).toEqual(fakeStudentsDb[2].name);
  });

  it('should sort an array of students by surname descending', () => {
    const result: Student[] = service.sortStudents(fakeStudentsDb, 'surname', 'descending');
    expect(result[0].name).toEqual(fakeStudentsDb[0].name);
    expect(result[1].name).toEqual(fakeStudentsDb[1].name);
    expect(result[2].name).toEqual(fakeStudentsDb[2].name);
  });
});
