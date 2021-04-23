import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit, OnDestroy {
  public student: Student;
  public isBadgeOpen = false;
  private paramsSub: Subscription;
  public dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  public isLoading = false;
  public noteUpdating: 'updating' | 'fail' | 'success' = null;

  constructor(
    private route: ActivatedRoute,
    private dbService: DataService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.paramMap.subscribe((params) => {
      this.loadStudent(params.get('id'));
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  public onDeleteClick() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { id: 'STUDENT_DELETE_DIALOG' });
    this.dialogRef.componentInstance.dialogTitle = 'Do You Really Want To Delete?';
    this.dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.deleteStudent();
      }
    });
  }

  public updateNote() {
    this.noteUpdating = 'updating';
    this.dbService.updateStudent(this.student).subscribe(
      (result) => {
        if (result) {
          this.noteUpdating = 'success';
        } else {
          this.noteUpdating = 'fail';
        }
        setTimeout(() => {
          this.noteUpdating = null;
        }, 1500);
      },
      () => {
        this.noteUpdating = 'fail';
        setTimeout(() => {
          this.noteUpdating = null;
        }, 1500);
      }
    );
  }

  private loadStudent(id: string) {
    this.isLoading = true;
    this.dbService.getStudentWithReceipts(id).subscribe((student) => {
      if (student) {
        this.student = student;
      }
      this.isLoading = false;
    });
  }

  private deleteStudent() {
    this.dbService.deleteStudent(this.student.id).subscribe((result) => {
      if (result) {
        this.router.navigate(['']);
      }
    });
  }
}
