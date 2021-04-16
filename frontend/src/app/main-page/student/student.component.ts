import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/main-page/data-service/data.service';
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

  constructor(
    private route: ActivatedRoute,
    private dbService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.paramMap.subscribe((params) => {
      this.loadStudent(params.get('id'));
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  private loadStudent(id: string) {
    this.dbService.getStudentWithReceipts(id).subscribe((student) => {
      if (student) {
        this.student = student;
      }
    });
  }

  public deleteStudent() {
    this.dbService.deleteStudent(this.student.id).subscribe((result) => {
      if (result) {
        this.router.navigate(['']);
      }
    });
  }

  public updateNote() {
    this.dbService.updateStudent(this.student).subscribe((result) => {
      if (result) {
        this.isBadgeOpen = true;
        setTimeout(() => {
          this.isBadgeOpen = false;
        }, 1000);
      } else {
        alert('Error Cannot Update');
      }
    });
  }
}
