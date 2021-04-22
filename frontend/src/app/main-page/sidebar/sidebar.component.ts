import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public students: Observable<Student[]>;
  private actualStudentIdLoaded: string = '';
  private reloadSub: Subscription;
  @Output()
  public linkPressed = new EventEmitter();

  constructor(private dbService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.students = this.dbService.getStudents();
    this.reloadSub = this.dbService.reload.subscribe((r) => {
      if (r) {
        this.students = this.dbService.getStudents();
      }
    });
  }

  ngOnDestroy() {
    this.reloadSub.unsubscribe();
  }

  navigateToStudent(studentId: string): void {
    if (this.actualStudentIdLoaded === '') {
      this.actualStudentIdLoaded = studentId;
    } else if (this.actualStudentIdLoaded === studentId) {
      this.actualStudentIdLoaded = '';
    } else {
      this.actualStudentIdLoaded = studentId;
    }
    this.linkPressed.emit();
    this.router.navigate([this.actualStudentIdLoaded]);
  }
}
