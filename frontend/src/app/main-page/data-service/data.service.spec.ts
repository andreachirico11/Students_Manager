import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FAKE_DB } from 'src/app/shared/fakeInterceptor/fakeDb';
import { receiptFakeResponses } from 'src/app/shared/fakeInterceptor/fakeReceiptRespObj';
import { studentFakeResponses } from 'src/app/shared/fakeInterceptor/fakeStudentsRespObj';
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
      expect(db.length).toBe(FAKE_DB.students.length);
      expect(db[0].name).toBe(FAKE_DB.students[0].name);
    });
    const req = controller.expectOne(dbUrl + 'students');
    req.flush(studentFakeResponses.getAllStudents());
    controller.verify();
  });

  it('should return a student with his receipts', () => {
    const testStudent = FAKE_DB.students[1],
      id = testStudent.id;
    service.getStudentWithReceipts(id).subscribe((s) => {
      expect(s.receipts.length).toBe(testStudent.receipts.length);
      expect(s.receipts[0].typeOfPayment).toBe(testStudent.receipts[0].typeOfPayment);
    });
    const req = controller.expectOne(dbUrl + 'students/' + id);
    const studentToReturn = fakeStudentsDb[0];
    studentToReturn.receipts = [...fakeReceiptsDb];
    req.flush(studentFakeResponses.getStudent(id));
    controller.verify();
  });

  it('should add a new student', () => {
    const studentToAdd: Student = { ...studentFakeResponses.postStudent().payload, id: null };
    service.addStudent(studentToAdd).subscribe((resultStudent) => {
      expect(studentToAdd.name).toEqual(resultStudent.name);
    });
    const req = controller.expectOne(dbUrl + 'students');
    req.flush(studentFakeResponses.postStudent());
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should update the student', () => {
    const studentWithUpdate = studentFakeResponses.putStudent().payload;
    service.updateStudent(studentWithUpdate).subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'students/' + studentWithUpdate.id);
    req.flush(studentFakeResponses.putStudent());
    expect(req.request.method).toBe('PUT');
    controller.verify();
  });

  it('should delete the student', () => {
    service.deleteStudent('1').subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'students/1');
    req.flush(studentFakeResponses.deleteStudent(''));
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });

  it('should emit reload on  delete the student', () => {
    service.reload.subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    service.deleteStudent('1').subscribe();
    const req = controller.expectOne(dbUrl + 'students/1');
    req.flush(studentFakeResponses.deleteStudent(''));
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });

  it('should add a new receipt', () => {
    const receiptToAdd: Receipt = { ...receiptFakeResponses.postReceipt().payload, id: null };
    service.addReceipt(fakeStudent.id, receiptToAdd).subscribe((r) => {
      expect(r).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + fakeStudent.id);
    req.flush(receiptFakeResponses.postReceipt());
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should update the receipt', () => {
    const receiptToUpdate: Receipt = { ...receiptFakeResponses.putReceipt().payload };
    service.updateReceipt(receiptToUpdate).subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + receiptToUpdate.id);
    req.flush(receiptFakeResponses.putReceipt());
    expect(req.request.method).toBe('PUT');
    controller.verify();
  });

  it('should delete the receipt', () => {
    const rid = FAKE_DB.students[0].receipts[0].id;
    service.deleteReceipt(rid).subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + rid);
    req.flush(receiptFakeResponses.deleteReceipt(rid));
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });
});
