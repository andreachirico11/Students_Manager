import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { SortOptions } from 'src/app/shared/models/sort-options';
import { Student } from 'src/app/shared/models/Student';
import { SortService } from '../forms/utils/sort-service/sort.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public students: Student[] = [];
  public sub: Subscription;

  @Output()
  public linkPressed = new EventEmitter();

  private actualStudentIdLoaded: string = '';
  private actualSortOptions: SortOptions;

  constructor(
    private dbService: DataService,
    private router: Router,
    private sortService: SortService
  ) {}

  ngOnInit(): void {
    this.actualSortOptions = this.sortService.localStSortOptions ?? {
      by: 'name',
      order: 'ascending',
    };
    this.sub = this.dbService.studentDbObservable.subscribe((newS) => {
      this.actualStudentIdLoaded = '';
      if (newS && newS.length > 0) {
        this.students = newS;
        this.changeSortOrder(this.actualSortOptions);
      }
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

  orderOnClick(orderCode: number) {
    switch (orderCode) {
      case 1:
        this.changeSortOrder({ by: 'name', order: 'ascending' });
        break;
      case 2:
        this.changeSortOrder({ by: 'name', order: 'descending' });
        break;
      case 3:
        this.changeSortOrder({ by: 'surname', order: 'ascending' });
        break;
      case 4:
        this.changeSortOrder({ by: 'surname', order: 'descending' });
        break;
    }
  }

  private changeSortOrder(newOptions: SortOptions) {
    this.actualSortOptions = newOptions;
    this.sortService.localStSortOptions = newOptions;
    this.students = this.sortService.sortStudents(this.students, this.actualSortOptions);
  }
}
