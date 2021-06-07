import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { Student } from 'src/app/shared/models/Student';
import { SortService } from '../forms/utils/sort-service/sort.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public students: Student[];
  public sub: Subscription;

  private actualStudentIdLoaded: string = '';
  @Output()
  public linkPressed = new EventEmitter();

  constructor(
    private dbService: DataService,
    private router: Router,
    private sortService: SortService
  ) {}

  ngOnInit(): void {
    this.sub = this.dbService.studentDbObservable.subscribe((newS) => {
      this.actualStudentIdLoaded = '';
      this.students = this.sortService.sortStudents(newS, 'name', 'ascending');
    });
    this.dbService.getStudents().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

  navigateToForm() {
    this.linkPressed.emit();
    this.router.navigate(['compilation', 'student']);
  }
}
