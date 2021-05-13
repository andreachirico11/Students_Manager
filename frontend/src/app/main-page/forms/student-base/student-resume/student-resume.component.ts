import { ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'student-resume',
  templateUrl: './student-resume.component.html',
  styleUrls: ['./student-resume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentResumeComponent {
  @Input()
  public student: Student;
  public okEv = new EventEmitter();
}
