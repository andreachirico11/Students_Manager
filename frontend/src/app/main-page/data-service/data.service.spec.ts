import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Receipt } from '../../shared/models/Receipts';
import { Student } from '../../shared/models/Student';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService, controller: HttpTestingController;
  const dbUrl = environment.dbUrl,
    fakeStudent = new Student('gianni', 'gianno', '', new Date(), '', '', [], [], '', '1'),
    fakeStudentsDb: Student[] = [
      { ...fakeStudent },
      { ...fakeStudent, id: '2' },
      { ...fakeStudent, id: '3' },
      { ...fakeStudent, id: '4' },
    ],
    fakeReceipt = new Receipt('', 10, new Date(), new Date(), 'Bancomat', '1'),
    fakeReceiptsDb: Receipt[] = [
      { ...fakeReceipt, id: '2', typeOfPayment: 'Bancomat' },
      { ...fakeReceipt, id: '3', typeOfPayment: 'Bonifico' },
      { ...fakeReceipt, id: '4', typeOfPayment: 'Moneta' },
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
      expect(db.length).toBe(4);
      expect(db[0].name).toBe('gianni');
    });
    const req = controller.expectOne(dbUrl + 'students');
    req.flush(fakeStudentsDb);
    controller.verify();
  });

  it('should return a student with his receipts', () => {
    service.getStudentWithReceipts(fakeStudentsDb[0].id).subscribe((s) => {
      expect(s.receipts.length).toBe(3);
      expect(s.receipts[0].typeOfPayment).toBe('Bancomat');
    });
    const req = controller.expectOne(dbUrl + 'students/1');
    const studentToReturn = fakeStudentsDb[0];
    studentToReturn.receipts = [...fakeReceiptsDb];
    req.flush(studentToReturn);
    controller.verify();
  });

  it('should add a new student', () => {
    const studentToAdd: Student = { ...fakeStudent, id: null },
      studentResponse: Student = { ...studentToAdd, id: '5' };
    service.addStudent(studentToAdd).subscribe((resultStudent) => {
      expect(studentToAdd.name).toEqual(resultStudent.name);
    });
    const req = controller.expectOne(dbUrl + 'students');
    req.flush(studentResponse);
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should update the student', () => {
    const notes = 'new note',
      studentWithUpdate: Student = { ...fakeStudent, notes };
    service.updateStudent(studentWithUpdate).subscribe((answer) => {
      expect(answer).toEqual(studentWithUpdate);
    });
    const req = controller.expectOne(dbUrl + 'students/' + studentWithUpdate.id);
    req.flush(studentWithUpdate);
    expect(req.request.method).toBe('PUT');
    controller.verify();
  });

  it('should delete the student', () => {
    service.deleteStudent('1').subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'students/1');
    req.flush(true);
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });

  it('should add a new receipt', () => {
    service.addReceipt(fakeStudent.id, fakeReceipt).subscribe((r) => {
      expect(r).toEqual(fakeReceipt);
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + fakeStudent.id);
    req.flush(fakeReceipt);
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should update the receipt', () => {
    service.updateReceipt(fakeReceipt).subscribe((answer) => {
      expect(answer).toEqual(fakeReceipt);
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + fakeReceipt.id);
    req.flush(fakeReceipt);
    expect(req.request.method).toBe('PUT');
    controller.verify();
  });

  it('should delete the receipt', () => {
    service.deleteReceipt('1').subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'receipts/1');
    req.flush(true);
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });
});
