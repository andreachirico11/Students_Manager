import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Receipt } from '../models/Receipts';
import { Student } from '../models/Student';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService, controller: HttpTestingController;
  const dbUrl = 'http://localhost:3000/',
    fakeStudentsDb = [new Student('1', 'gianni', 'gianno', '', new Date(), '', '', [], [], '')],
    fakeReceiptsDb = [
      new Receipt('1', '', 10, new Date(), new Date(), 'Bancomat'),
      new Receipt('14', '', 10, new Date(), new Date(), 'Bonifico'),
    ];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(DataService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of students', () => {
    service.getStudents().subscribe((db) => {
      expect(db.length).toBe(1);
      expect(db[0] instanceof Student).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'students');
    req.flush(fakeStudentsDb);
    controller.verify;
  });

  // it('should return an array of receipts', () => {
  //   service.getReceiptsForStudent(fakeStudentsDb[0].receipts).subscribe((db) => {
  //     expect(db.length).toBe(2);
  //     expect(db[0] instanceof Receipt).toBeTruthy();
  //     expect(db[0].typeOfPayment === 'Bancomat').toBeTruthy();
  //     expect(db[1].typeOfPayment === 'Bonifico').toBeTruthy();
  //   });
  //   const req = controller.expectOne(dbUrl + 'receipts');
  //   req.flush(fakeReceiptsDb);
  //   controller.verify;
  // });
});
