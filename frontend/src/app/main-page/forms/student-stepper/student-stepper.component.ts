import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Parent } from 'src/app/shared/models/Parent';
import { Student } from 'src/app/shared/models/Student';
import { UpdateDataService } from 'src/app/shared/update-data.service';
import { DataService } from '../../data-service/data.service';
import { ComponentGuarded } from '../utils/guard-base.component';

@Component({
  selector: 'app-student-stepper',
  templateUrl: './student-stepper.component.html',
  styleUrls: ['./student-stepper.component.scss'],
})
export class StudentStepperComponent extends ComponentGuarded implements OnInit {
  public studentCreated: Student = null;
  public studentUnderUpdate: Student = null;
  public labels: string[] = [];

  @ViewChild(MatHorizontalStepper)
  private stepper: MatHorizontalStepper;

  constructor(
    dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private updateDataService: UpdateDataService<Student>,
    private translate: TranslateService
  ) {
    super(dialog);
  }

  ngOnInit(): void {
    const studentToUpdateId: string = this.activatedRoute.snapshot.params['id'];
    if (studentToUpdateId) {
      this.collectStudentToUpdate(studentToUpdateId);
    }
    this.translate
      .get('FORMS.STEPS')
      .pipe(first())
      .subscribe((res) => (this.labels = res));
  }

  onStudentFormEv(result: any) {
    this.studentCreated = this.generateStudent(result);
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onParentFormEv(result: any) {
    const { name, surname, fiscalCode, phoneNumber, address } = result;
    const parent = new Parent(name, surname, fiscalCode, address, phoneNumber);
    this.studentCreated = { ...this.studentCreated, parent };
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onOk() {
    if (this.studentUnderUpdate) {
      this.updateStudent();
    } else {
      this.addNewStudent();
    }
  }

  onFormValueChange() {
    this.canLeave = false;
  }

  private collectStudentToUpdate(studentToUpdateId: string) {
    const stToUp = this.generateStudent(this.updateDataService.getElementUnderUpdate());
    if (stToUp && stToUp.schoolClass && stToUp.id && stToUp.id === studentToUpdateId) {
      this.studentUnderUpdate = stToUp;
    }
  }

  private updateStudent() {
    this.studentCreated.id = this.studentUnderUpdate.id;
    this.onAddOrUpdateResp(this.dataService.updateStudent(this.studentCreated));
  }

  private addNewStudent() {
    this.onAddOrUpdateResp(this.dataService.addStudent(this.studentCreated));
  }

  private onAddOrUpdateResp(rObs: Observable<boolean>) {
    rObs.subscribe((r) => {
      const addOrUpdat = this.studentUnderUpdate ? 'Updat' : 'Add';
      if (r) {
        this.canLeave = true;
        this.openDialog(() => this.navigateHome(), `Student ${addOrUpdat}ed Successfully`);
      } else {
        this.openDialog(() => this.resetStepper(), `There was a Problem ${addOrUpdat}ing Student`);
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

  private generateStudent(obj: any): Student {
    const {
      name,
      surname,
      schoolClass,
      dateOfBirth,
      fiscalCode,
      phoneNumber,
      parent,
      address,
      id,
    } = obj;
    return new Student(
      name,
      surname,
      schoolClass,
      dateOfBirth,
      fiscalCode,
      phoneNumber,
      parent,
      [],
      address,
      '',
      id
    );
  }

  private resetStepper() {
    this.stepper.selectedIndex = 0;
    this.stepper.steps.forEach((step) => {
      step.completed = false;
    });
  }

  private navigateHome() {
    this.router.navigate(['']);
  }
}
