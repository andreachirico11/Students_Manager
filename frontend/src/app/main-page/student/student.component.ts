import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { switchMap, switchMapTo, tap, timeout } from 'rxjs/operators';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DeleteConfirmationDialogService } from 'src/app/shared/delete-confirmation-dialog.service';
import { Student } from 'src/app/shared/models/Student';
import { UpdateDataService } from 'src/app/shared/update-data.service';

@Component({
  selector: 'student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit, OnDestroy {
  public student: Student = null;
  public isBadgeOpen = false;
  public isLoading = false;
  public isUpdatingNote = false;

  private paramsSub: Subscription;
  private noteUpdateSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dbService: DataService,
    private router: Router,
    private updateDataService: UpdateDataService<Student>,
    private translate: TranslateService,
    private deleteDialog: DeleteConfirmationDialogService,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.paramMap.subscribe((params) => {
      this.loadStudent(params.get('id'));
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  public onEditClick() {
    this.updateDataService.elementUnderUpdate = { ...this.student };
    this.router.navigate(['compilation', 'student', this.student.id]);
  }

  public onDeleteClick() {
    this.deleteDialog.open('STUDENT_DELETE_DIALOG').subscribe((res) => {
      if (res) {
        this.deleteStudent();
      }
    });
  }

  public onDownloadNavigation() {
    if (/printout/.test(window.location.href)) {
      this.location.back();
    } else {
      this.router.navigate(['printout'], { relativeTo: this.route });
    }
  }

  public onNoteinput() {
    if (!this.noteUpdateSub) {
      this.noteUpdateSub = timer(1000)
        .pipe(
          tap(() => {
            this.isUpdatingNote = true;
          }),
          switchMapTo(this.dbService.updateStudent(this.student))
        )
        .subscribe(() => {
          this.noteUpdateSub.unsubscribe();
          this.noteUpdateSub = null;
          setTimeout(() => {
            this.isUpdatingNote = false;
          }, 500);
        });
    }
  }

  private loadStudent(id: string) {
    this.isLoading = true;
    this.dbService.getStudentWithReceipts(id).subscribe((student: Student) => {
      if (student) {
        this.student = student;
      }
      this.isLoading = false;
    });
  }

  private deleteStudent() {
    let res = null;
    this.dbService
      .deleteStudent(this.student.id)
      .pipe(
        switchMap((resp) => {
          res = resp;
          return this.translate.get('DIALOG');
        }),
        switchMap((translations) => {
          if (res) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent);
            if (typeof res === 'string') {
              dialogRef.componentInstance.dialogTitle = res;
            } else {
              dialogRef.componentInstance.dialogTitle = translations['ST_DEL_SUCC'];
            }
            dialogRef.componentInstance.onlyConfirmation = true;
            dialogRef.componentInstance.successBtnLabel = translations['YES'];
            return dialogRef.afterClosed();
          }
        })
      )
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['']);
        }
      });
  }
}
