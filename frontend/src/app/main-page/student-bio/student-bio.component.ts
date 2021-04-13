import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'student-bio',
  templateUrl: './student-bio.component.html',
  styleUrls: ['./student-bio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentBioComponent implements OnInit {
  @Input()
  public student: Student;
  public note;

  ngOnInit() {
    this.note = this.student.notes;
  }
}
