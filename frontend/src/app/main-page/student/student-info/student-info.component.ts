import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentInfoComponent {
  @Input()
  public student: Student;
}
