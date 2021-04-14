import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from 'src/app/shared/data-service/data.service';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  // @Input()
  // public student: Student;
  // public note;

  // @Output()
  // public updatedNoteEvent = new EventEmitter<string>();

  // ngOnInit() {
  //   if (this.student) {
  //     this.note = this.student.notes || '';
  //   }
  // }

  public student: Student;
  public note;

  constructor(private route: ActivatedRoute, private dbService: DataService) {}

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
}
