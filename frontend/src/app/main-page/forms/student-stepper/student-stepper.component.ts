import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { getFakeStudents } from 'src/app/shared/fakeInterceptor/fakeDb';
import { Parent } from 'src/app/shared/models/Parent';
import { Student } from 'src/app/shared/models/Student';
import { DataService } from '../../data-service/data.service';

@Component({
  selector: 'app-student-stepper',
  templateUrl: './student-stepper.component.html',
  styleUrls: ['./student-stepper.component.scss'],
})
export class StudentStepperComponent implements OnInit {
  public studentCreated: Student = null;

  @ViewChild(MatHorizontalStepper)
  private stepper: MatHorizontalStepper;

  constructor(
    private dataService: DataService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onStudentFormEv(student: Partial<Student>) {
    this.studentCreated = new Student(
      student.name,
      student.surname,
      student.schoolClass,
      student.dateOfBirth,
      student.fiscalCode,
      student.phoneNumber,
      null,
      [],
      student.address
    );
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onParentFormEv(parent: Parent) {
    this.studentCreated = { ...this.studentCreated, parent };
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onOk() {
    this.dataService.addStudent(this.studentCreated).subscribe((r) => {
      if (r) {
        this.openDialog(() => this.navigateHome(), 'Student Added Successfully');
      } else {
        this.openDialog(() => this.resetStepper(), 'There was a problem adding Student');
      }
    });
  }

  private openDialog(callBack: Function, title: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.dialogTitle = title;
    dialogRef.componentInstance.onlyConfirmation = true;
    dialogRef.afterClosed().subscribe(() => {
      callBack();
    });
  }

  private navigateHome() {
    this.router.navigate(['']);
  }

  private resetStepper() {
    this.stepper.selectedIndex = 0;
    this.stepper.steps.forEach((step) => {
      step.completed = false;
    });
  }
}
