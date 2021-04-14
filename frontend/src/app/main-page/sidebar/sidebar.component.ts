import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/shared/data-service/data.service';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public students: Observable<Student[]>;

  constructor(private dbService: DataService) {}

  ngOnInit(): void {
    this.students = this.dbService.getStudents();
  }
}
