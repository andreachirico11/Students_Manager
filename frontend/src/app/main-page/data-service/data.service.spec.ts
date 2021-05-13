import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { getFakeStudents } from 'src/app/shared/fakeInterceptor/fakeDb';
import { ReceiptFakeResponses } from 'src/app/shared/fakeInterceptor/fakeReceiptRespObj';
import { StudentFakeResponses } from 'src/app/shared/fakeInterceptor/fakeStudentsRespObj';
import { environment } from 'src/environments/environment';
import { Receipt } from '../../shared/models/Receipts';
import { Student } from '../../shared/models/Student';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService, controller: HttpTestingController;
  const dbUrl = environment.dbUrl,
    fakeStudent = new Student(
      'gianni',
      'gianno',
      '',
      new Date(),
      '',
      '',
      { name: 'a', surname: 'b', dateOfBirth: new Date(), fiscalCode: 'aaaaaa' },
      [],
      '',
      '1'
    ),
    fakeStudentsDb: Student[] = getFakeStudents(),
    studenfFakeResps = new StudentFakeResponses(fakeStudentsDb),
    receiptsFakeResps = new ReceiptFakeResponses(fakeStudentsDb);

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
      expect(db.length).toBe(fakeStudentsDb.length);
      expect(db[0].name).toBe(fakeStudentsDb[0].name);
    });
    const req = controller.expectOne(dbUrl + 'students');
    req.flush(studenfFakeResps.getAllStudents());
    controller.verify();
  });

  it('should return a student with his receipts', () => {
    const testStudent = { ...fakeStudentsDb[1] },
      id = testStudent.id;
    service.getStudentWithReceipts(id).subscribe((s) => {
      expect(s.receipts.length).toBe(testStudent.receipts.length);
      expect(s.receipts[0].typeOfPayment).toBe(testStudent.receipts[0].typeOfPayment);
    });
    const req = controller.expectOne(dbUrl + 'students/' + id);
    req.flush(studenfFakeResps.getStudent(id));
    controller.verify();
  });

  it('should add a new student', () => {
    const studentToAdd: Student = { ...studenfFakeResps.postStudent().payload, id: null };
    service.addStudent(studentToAdd).subscribe((resultStudent) => {
      expect(studentToAdd.name).toEqual(resultStudent.name);
    });
    const req = controller.expectOne(dbUrl + 'students');
    req.flush(studenfFakeResps.postStudent());
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should update the student', () => {
    const studentWithUpdate = studenfFakeResps.putStudent().payload;
    service.updateStudent(studentWithUpdate).subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'students/' + studentWithUpdate.id);
    req.flush(studenfFakeResps.putStudent());
    expect(req.request.method).toBe('PUT');
    controller.verify();
  });

  // sbagliato dovrebbe arrivare true
  xit('should delete the student', () => {
    service.deleteStudent('1').subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'students/1');
    req.flush(studenfFakeResps.deleteStudent(''));
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });

  it('should emit reload on  delete the student', () => {
    service.reload.subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    service.deleteStudent('1').subscribe();
    const req = controller.expectOne(dbUrl + 'students/1');
    req.flush(studenfFakeResps.deleteStudent(''));
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });

  it('should add a new receipt', () => {
    const receiptToAdd: Receipt = { ...receiptsFakeResps.postReceipt().payload, id: null };
    service.addReceipt(fakeStudent.id, receiptToAdd).subscribe((r) => {
      expect(r).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + fakeStudent.id);
    req.flush(receiptsFakeResps.postReceipt());
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should return false if error is returned', () => {
    const receiptToAdd: Receipt = { ...receiptsFakeResps.postReceipt().payload, id: null };
    service.addReceipt(fakeStudent.id, receiptToAdd).subscribe((r) => {
      expect(r).toBeFalse();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + fakeStudent.id);
    req.error(new ErrorEvent(''));
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should update the receipt', () => {
    const receiptToUpdate: Receipt = { ...receiptsFakeResps.putReceipt().payload };
    service.updateReceipt(receiptToUpdate).subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + receiptToUpdate.id);
    req.flush(receiptsFakeResps.putReceipt());
    expect(req.request.method).toBe('PUT');
    controller.verify();
  });

  it('should delete the receipt', () => {
    const rid = fakeStudentsDb[0].receipts[0].id;
    service.deleteReceipt(rid).subscribe((answer) => {
      expect(answer).toBeTruthy();
      expect(fakeStudentsDb[0].receipts.find((r) => r.id === rid)).toBeFalsy();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + rid);
    req.flush(receiptsFakeResps.deleteReceipt(rid));
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });
});
