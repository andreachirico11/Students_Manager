import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentComponent implements OnInit {
  @Input()
  public student: Student;
  public note;

  @Output()
  public updatedNoteEvent = new EventEmitter<string>();

  ngOnInit() {
    if (this.student) {
      this.note = this.student.notes || '';
    }
  }
}
