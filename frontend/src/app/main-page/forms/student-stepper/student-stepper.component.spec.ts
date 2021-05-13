import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { getFakeStudents } from 'src/app/shared/fakeInterceptor/fakeDb';
import { Parent } from 'src/app/shared/models/Parent';
import { Student } from 'src/app/shared/models/Student';
import { ParentFormComponent } from './parent-form/parent-form.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentResumeComponent } from './student-resume/student-resume.component';

import { StudentStepperComponent } from './student-stepper.component';

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
    studentForm.studentF.patchValue({
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
      imports: [CommonModule, MaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    (fakeStudent = getFakeStudents()[0]),
      (fixture = TestBed.createComponent(StudentStepperComponent));
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

  fit('Should launch the correct methods', () => {
    const onStSpy = stepperSpyGen('onStudentFormEv'),
      onParentSpy = stepperSpyGen('onParentFormEv'),
      onResumeSpy = stepperSpyGen('onOk'),
      partialS = getPartialStudent();
    fillStudentForm(partialS);
    studentForm.onSubmit();
    expect(onStSpy).toHaveBeenCalledOnceWith(partialS);
    // finire con gli altri
  });
});
