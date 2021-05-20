import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { last } from 'rxjs/operators';
import { getFakeStudents } from 'src/app/shared/fakeInterceptor/fakeDb';
import { ReceiptFakeResponses } from 'src/app/shared/fakeInterceptor/fakeReceiptRespObj';
import { StudentFakeResponses } from 'src/app/shared/fakeInterceptor/fakeStudentsRespObj';
import { environment } from 'src/environments/environment';
import { Receipt } from '../../shared/models/Receipts';
import { Student } from '../../shared/models/Student';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService, controller: HttpTestingController;
  const dbUrl = environment.dbUrl;
  let fakeStudentsDb: Student[],
    studenfFakeResps: StudentFakeResponses,
    receiptsFakeResps: ReceiptFakeResponses;

  beforeEach(() => {
    fakeStudentsDb = getFakeStudents();
    studenfFakeResps = new StudentFakeResponses(fakeStudentsDb);
    receiptsFakeResps = new ReceiptFakeResponses(fakeStudentsDb);

    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(DataService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of students', () => {
    service.getStudents().subscribe((res) => {
      expect(res).toBeTrue();
    });
    const req = controller.expectOne(dbUrl + 'students');
    req.flush(studenfFakeResps.getAllStudents());
    controller.verify();
  });

  it('should update student subject when getStudents is called', () => {
    service.studentDbObservable.subscribe((students) => {
      expect(students[0].name).toBe(studenfFakeResps.getAllStudents().payload[0].name);
    });
    service.getStudents().subscribe();
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
    const studentToAdd: Student = { ...fakeStudentsDb[0], name: 'carlo' };
    service.addStudent(studentToAdd).subscribe((r) => {
      expect(r).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'students');
    req.flush(studenfFakeResps.postStudent(studentToAdd));
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should update the student', () => {
    const studentWithUpdate = { ...fakeStudentsDb[0], name: 'carlo' };
    service.updateStudent(studentWithUpdate).subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'students/' + studentWithUpdate.id);
    req.flush(studenfFakeResps.putStudent(studentWithUpdate));
    expect(req.request.method).toBe('PUT');
    controller.verify();
  });

  it('should delete the student', () => {
    service.deleteStudent('1').subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'students/1');
    req.flush(studenfFakeResps.deleteStudent(''));
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });

  it('should update the local db without the deleted student', () => {
    const idToDelete = fakeStudentsDb[0].id;
    service.studentDbObservable.pipe(last()).subscribe((students) => {
      expect(students.find((s) => s.id === idToDelete)).toBeFalsy();
    });
    service.deleteStudent(idToDelete).subscribe();
    const req = controller.expectOne(dbUrl + 'students/' + idToDelete);
    req.flush(studenfFakeResps.deleteStudent(idToDelete));
    expect(req.request.method).toBe('DELETE');
    controller.verify();
  });

  it('should add a new receipt', () => {
    const owner = fakeStudentsDb[0],
      receiptToAdd: Receipt = { ...owner.receipts[0], id: null };
    service.addReceipt(owner.id, receiptToAdd).subscribe((r) => {
      expect(r).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + owner.id);
    req.flush(receiptsFakeResps.postReceipt(owner.id, receiptToAdd));
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should return false if error is returned', () => {
    const receiptToAdd: Receipt = { ...fakeStudentsDb[0].receipts[0], id: null };
    service.addReceipt('123', receiptToAdd).subscribe((r) => {
      expect(r).toBeFalse();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + '123');
    req.error(new ErrorEvent(''));
    expect(req.request.method).toBe('POST');
    controller.verify();
  });

  it('should update the receipt', () => {
    const receiptToUpdate: Receipt = { ...fakeStudentsDb[0].receipts[0] };
    service.updateReceipt(receiptToUpdate).subscribe((answer) => {
      expect(answer).toBeTruthy();
    });
    const req = controller.expectOne(dbUrl + 'receipts/' + receiptToUpdate.id);
    req.flush(receiptsFakeResps.putReceipt(receiptToUpdate));
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
