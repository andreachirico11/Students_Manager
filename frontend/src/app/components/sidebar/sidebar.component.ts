import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/models/Student';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public students: Observable<Student[]>;
  @Output()
  public studentSelected = new EventEmitter<Student>();

  constructor(private dbService: DataService) {}

  ngOnInit(): void {
    this.students = this.dbService.getStudents();
  }
}
