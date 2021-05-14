import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { getFakeStudents } from 'src/app/shared/fakeInterceptor/fakeDb';
import { Parent } from 'src/app/shared/models/Parent';
import { Student } from 'src/app/shared/models/Student';
import { DataService } from '../../data-service/data.service';
import { ParentFormComponent } from './parent-form/parent-form.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentResumeComponent } from './student-resume/student-resume.component';
import { StudentStepperComponent } from './student-stepper.component';

let matDialogResp = null;
class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(matDialogResp),
      componentInstance: {
        dialogTitle: '',
      },
    };
  }
}

describe('StudentStepperComponent', () => {
  let component: StudentStepperComponent;
  let studentForm: StudentFormComponent;
  let parentForm: ParentFormComponent;
  let studentResume: StudentResumeComponent;
  let fixture: ComponentFixture<StudentStepperComponent>;
  let fakeStudent: Student;

  const stepperSpyGen = (methodName) => spyOn(component, methodName);
  const getPartialStudent = (): Partial<Student> => {
    const { name, surname, dateOfBirth, fiscalCode, phoneNumber, address, schoolClass } =
      fakeStudent;
    return { name, surname, dateOfBirth, fiscalCode, phoneNumber, address, schoolClass };
  };
  const fillStudentForm = (partialStudent: Partial<Student>) => {
    studentForm.studentF.patchValue({
      ...partialStudent,
    });
  };
  const fillParentForm = (parent: Parent) => {
    parentForm.parentF.patchValue({
      ...parent,
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StudentStepperComponent,
        StudentFormComponent,
        ParentFormComponent,
        StudentResumeComponent,
      ],
      imports: [
        HttpClientTestingModule,
        CommonModule,
        MaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {
          provide: MatDialog,
          useClass: MockMatDialog,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fakeStudent = getFakeStudents()[0];
    fixture = TestBed.createComponent(StudentStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    studentForm = fixture.debugElement.query(By.directive(StudentFormComponent)).componentInstance;
    parentForm = fixture.debugElement.query(By.directive(ParentFormComponent)).componentInstance;
    studentResume = fixture.debugElement.query(
      By.directive(StudentResumeComponent)
    ).componentInstance;
  });

  it('should create with components', () => {
    expect(component).toBeTruthy();
    expect(studentForm).toBeTruthy();
    expect(parentForm).toBeTruthy();
    expect(studentResume).toBeTruthy();
  });

  it('Should launch the correct methods', () => {
    const onStSpy = stepperSpyGen('onStudentFormEv'),
      onParentSpy = stepperSpyGen('onParentFormEv'),
      onResumeSpy = stepperSpyGen('onOk'),
      partialS = getPartialStudent();
    fillStudentForm(partialS);
    studentForm.onSubmit();
    expect(onStSpy).toHaveBeenCalledOnceWith(partialS);
    fillParentForm(fakeStudent.parent);
    parentForm.onSubmit();
    expect(onParentSpy).toHaveBeenCalledOnceWith(fakeStudent.parent);
    studentResume.okEv.emit();
    expect(onResumeSpy).toHaveBeenCalled();
  });

  it('should display correctly datas', () => {
    const partialS = getPartialStudent(),
      fakeParent = new Parent(
        fakeStudent.parent.name,
        fakeStudent.parent.surname,
        fakeStudent.parent.fiscalCode,
        fakeStudent.parent.address,
        fakeStudent.parent.phoneNumber
      );
    fillStudentForm(partialS);
    studentForm.onSubmit();
    fillParentForm(fakeParent);
    parentForm.onSubmit();
    fixture.detectChanges();
    expect(studentResume.student.parent.address === fakeParent.address).toBeTruthy();
  });

  it('should open success dialog on success', () => {
    matDialogResp = true;
    const navigateSpy = spyOn<any>(component, 'navigateHome');
    spyOn(TestBed.inject(DataService), 'addStudent').and.returnValue(of(true));
    component.studentCreated = { ...fakeStudent };
    component.onOk();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should reset stepper on fail', () => {
    matDialogResp = false;
    const resetSpy = spyOn<any>(component, 'resetStepper');
    spyOn(TestBed.inject(DataService), 'addStudent').and.returnValue(of(false));
    component.studentCreated = { ...fakeStudent };
    component.onOk();
    expect(resetSpy).toHaveBeenCalled();
  });
});
