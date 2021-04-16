import { Component } from '@angular/core';
import { DataService } from './main-page/data-service/data.service';
import { FAKE_DB } from './shared/fakeInterceptor/fakeDb';
import { Student } from './shared/models/Student';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private s: DataService) {
    s.deleteStudent('').subscribe();
  }
}
