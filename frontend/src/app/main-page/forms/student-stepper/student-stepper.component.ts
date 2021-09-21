import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Parent } from 'src/app/shared/models/Parent';
import { Student } from 'src/app/shared/models/Student';
import { ObjectComparatorService } from 'src/app/shared/object-comparator/object-comparator.service';
import { UpdateDataService } from 'src/app/shared/update-data.service';
import { DataService } from '../../data-service/data.service';
import { ComponentGuarded } from '../utils/guard-base.component';

@Component({
  selector: 'student-stepper',
  templateUrl: './student-stepper.component.html',
  styleUrls: ['./student-stepper.component.scss'],
})
export class StudentStepperComponent extends ComponentGuarded implements OnInit {
  public studentCreated: Student = null;
  public studentUnderUpdate: Student = null;
  public labels: string[] = [];
  public get orientation$(): Observable<StepperOrientation> {
    return this.onViewBreakpoint('vertical', 'horizontal');
  }
  public get padding$(): Observable<string> {
    return this.onViewBreakpoint('0em', '2em');
  }

  @ViewChild(MatStepper)
  private stepper: MatStepper;

  constructor(
    dialog: MatDialog,
    trans: TranslateService,
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private updateDataService: UpdateDataService<Student>,
    private translate: TranslateService,
    private objComparatorSrv: ObjectComparatorService,
    private breakPointObs: BreakpointObserver
  ) {
    super(dialog, trans);
  }

  ngOnInit(): void {
    const studentToUpdateId: string = this.activatedRoute.snapshot.params['id'];
    if (studentToUpdateId) {
      this.collectStudentToUpdate(studentToUpdateId);
    }
    this.getTranslations();
  }

  onStudentFormEv(result: any) {
    this.studentCreated = this.generateStudent(result);
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onParentFormEv(result: any) {
    const { name, surname, fiscalCode, phoneNumber, address } = result;
    const parent = new Parent(
      name,
      surname,
      phoneNumber ? Number(phoneNumber) : null,
      fiscalCode,
      address
    );
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
  private onViewBreakpoint(ifTrue: any, ifFalse: any): Observable<any> {
    return this.breakPointObs.observe('(max-width: 549px)').pipe(
      map((state: BreakpointState) => {
        return state.matches ? ifTrue : ifFalse;
      })
    );
  }

  private collectStudentToUpdate(studentToUpdateId: string) {
    const stToUp = this.generateStudent(this.updateDataService.getElementUnderUpdate());
    if (stToUp && stToUp.id && stToUp.id === studentToUpdateId) {
      this.studentUnderUpdate = stToUp;
    }
  }

  private getTranslations() {
    this.translate
      .get('FORMS.STEPS')
      .pipe(first())
      .subscribe((res) => (this.labels = res));
  }

  private updateStudent() {
    this.studentCreated.id = this.studentUnderUpdate.id;
    if (this.objComparatorSrv.areObjEquals(this.studentCreated, this.studentUnderUpdate)) {
      return this.navigateHome();
    }
    this.onAddOrUpdateResp(this.dataService.updateStudent(this.studentCreated));
  }

  private addNewStudent() {
    this.onAddOrUpdateResp(this.dataService.addStudent(this.studentCreated));
  }

  private onAddOrUpdateResp(rObs: Observable<boolean>) {
    rObs.subscribe((r) => {
      if (r) {
        this.canLeave = true;
        this.openDialog(
          () => this.navigateHome(),
          this.studentUnderUpdate
            ? this.translations['ST_UPDT_SUCC']
            : this.translations['ST_ADD_SUCC']
        );
      } else {
        this.openDialog(
          () => this.resetStepper(),
          this.studentUnderUpdate
            ? this.translations['ST_UPDT_ERR']
            : this.translations['ST_ADD_ERR']
        );
      }
    });
  }

  private openDialog(callBack: Function, title: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.dialogTitle = title;
    dialogRef.componentInstance.onlyConfirmation = true;
    dialogRef.componentInstance.successBtnLabel = this.translations['YES'];
    dialogRef.componentInstance.unsuccessBtnLabel = this.translations['NO'];
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
      isWithRec,
    } = obj;
    return new Student(
      name,
      surname,
      parent,
      [],
      isWithRec,
      dateOfBirth,
      phoneNumber ? Number(phoneNumber) : null,
      fiscalCode,
      schoolClass,
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
