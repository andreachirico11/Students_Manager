import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Directive, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { MaterialModule } from 'src/app/material.module';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';
import { StudentComponent } from './student.component';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;
  let dbServ: DataService;
  let router: Router;

  const receipt = new Receipt(3, new Date(), '12345', 'money', new Date(), 'r1'),
    student = new Student(
      'gianni',
      'gianno',
      {
        name: 'a',
        surname: 'b',
        fiscalCode: 'aaaaaa',
        address: 'asdfjhalfbanflasdbfasf',
        phoneNumber: 1111111111111111111,
      },
      [receipt],
      new Date(),
      1,
      '',
      '',
      '',
      'notes',
      '1'
    ),
    newNoteText = 'new note',
    params = {
      id: 's1',
      get(_: string) {
        return this.id;
      },
    },
    paramsSubject = new Subject(),
    getByCss = (css: string) => fixture.debugElement.query(By.css(css)),
    getButtons = () => fixture.debugElement.queryAll(By.css('button')),
    createGetStSpy = (valueToReturn) =>
      spyOn(dbServ, 'getStudentWithReceipts').and.returnValue(of(valueToReturn)),
    updateComponent = () => {
      component.ngOnInit();
      fixture.detectChanges();
    };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentComponent, FakeReceiptsTableComponent, FakeStudentInfoComponent],
      imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramsSubject.asObservable(),
          },
        },
        {
          provide: MatDialog,
          useClass: MockMatDialog,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    dbServ = TestBed.inject(DataService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can load a student from the id in the url', () => {
    const dbServiceSpy = createGetStSpy(student);
    paramsSubject.next(params);
    updateComponent();
    expect(dbServiceSpy).toHaveBeenCalledOnceWith('s1');
    expect(component.student).toEqual(student);
  });

  it('change internal student according to url change', () => {
    let studentToReturn: Student = { ...student };
    const dbServiceSpy = createGetStSpy(studentToReturn);
    updateComponent();
    paramsSubject.next(params);
    expect(dbServiceSpy).toHaveBeenCalledWith('s1');
    expect(component.student).toEqual(studentToReturn);
    const newId = 's_2';
    studentToReturn.id = newId;
    paramsSubject.next({ ...params, id: newId });
    expect(dbServiceSpy).toHaveBeenCalledWith(newId);
    expect(component.student).toEqual(studentToReturn);
  });

  it('change rendered student according to url change', () => {
    let studentToReturn: Student = { ...student };
    createGetStSpy(studentToReturn);
    paramsSubject.next(params);
    updateComponent();
    expect(component.student.name).toBe(studentToReturn.name);
    const newId = 's_2',
      newName = 'Carlo';
    studentToReturn.id = newId;
    studentToReturn.name = newName;
    paramsSubject.next({ ...params, id: newId });
    updateComponent();
    expect(component.student.name).toBe(newName);
  });

  it('should render the other template if no student is found', () => {
    createGetStSpy(null);
    paramsSubject.next(params);
    updateComponent();
    expect(getByCss('.noStudent')).toBeTruthy();
  });

  it('should launch delete method on true value returned from modal', () => {
    createGetStSpy(student);
    paramsSubject.next(params);
    updateComponent();
    const deleteSpy = spyOn(dbServ, 'deleteStudent').and.returnValue(of(true));
    const deleteBtn = getButtons()[2].nativeElement;
    deleteBtn.click();
    fixture.detectChanges();
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should remove students', () => {
    createGetStSpy(student);
    paramsSubject.next(params);
    updateComponent();
    spyOn(dbServ, 'deleteStudent').and.returnValue(of(true));
    const routerSpy = spyOn(router, 'navigate');
    const deleteBtn = getButtons()[2].nativeElement;
    deleteBtn.click();
    expect(routerSpy).toHaveBeenCalledOnceWith(['']);
  });

  it('it should update note and send it to db', () => {
    createGetStSpy(student);
    paramsSubject.next(params);
    updateComponent();
    const textarea = getByCss('textarea').nativeElement;
    textarea.value = newNoteText;
    textarea.dispatchEvent(new Event('input'));
    expect(component.student.notes).toBe(newNoteText);
    const updateMethod = spyOn(dbServ, 'updateStudent').and.returnValue(of(true));
    const updateBtn = getButtons()[0].nativeElement;
    updateBtn.click();
    expect(updateMethod).toHaveBeenCalledOnceWith(component.student);
  });

  it('should open and automatically close the success badge', fakeAsync(() => {
    createGetStSpy(student);
    paramsSubject.next(params);
    updateComponent();
    spyOn(dbServ, 'updateStudent').and.returnValue(of(true));
    expect(getByCss('.note-update-container')).toBeNull();
    const updateBtn = getButtons()[0].nativeElement;
    updateBtn.click();
    fixture.detectChanges();
    expect(getByCss('.note-update-container')).toBeTruthy();
    tick(1500);
    fixture.detectChanges();
    expect(getByCss('.note-update-container')).toBeNull();
  }));

  it('should display the note update load badge', fakeAsync(() => {
    createGetStSpy(student);
    paramsSubject.next(params);
    updateComponent();
    const updateBtn = getButtons()[0].nativeElement;
    updateBtn.click();
    fixture.detectChanges();
    expect(getByCss('mat-progress-bar')).toBeTruthy();
  }));

  it('should display the note update success badge', fakeAsync(() => {
    createGetStSpy(student);
    paramsSubject.next(params);
    updateComponent();
    spyOn(dbServ, 'updateStudent').and.returnValue(of(true));
    const updateBtn = getButtons()[0].nativeElement;
    updateBtn.click();
    tick(500);
    fixture.detectChanges();
    expect(getByCss('.note-update-container mat-icon').nativeElement.textContent).toBe('done');
    tick(1000);
  }));

  it('should display the note update fail badge', fakeAsync(() => {
    createGetStSpy(student);
    paramsSubject.next(params);
    updateComponent();
    spyOn(dbServ, 'updateStudent').and.returnValue(of(null));
    const updateBtn = getButtons()[0].nativeElement;
    updateBtn.click();
    tick(500);
    fixture.detectChanges();
    expect(getByCss('.note-update-container mat-icon').nativeElement.textContent).toBe('warning');
    tick(1000);
  }));
});

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true),
      componentInstance: {
        dialogTitle: '',
      },
    };
  }
}
@Directive({
  selector: 'routerLink',
})
export class FakeRouterLink {}

@Component({
  selector: 'student-receipts',
  template: ``,
})
export class FakeReceiptsTableComponent {
  @Input()
  public receipts: Receipt[] = [];

  @Input()
  public owner: Student;
}

@Component({
  selector: 'student-info',
  template: ``,
})
export class FakeStudentInfoComponent {
  @Input()
  public student: Student;
}
