import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data-service/data.service';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  public student: Student;
  public note;
  public isBadgeOpen = false;

  constructor(
    private route: ActivatedRoute,
    private dbService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.loadStudent(id);
  }

  private loadStudent(id: string) {
    this.dbService.getStudentWithReceipts(id).subscribe((student) => {
      if (student) {
        this.student = student;
        this.note = student.notes || '';
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
    this.dbService.updateStudentNote(this.student.id, this.note).subscribe((result) => {
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
