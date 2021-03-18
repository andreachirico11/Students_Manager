import { Component } from '@angular/core';
import { Student } from './models/Student';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private _selectedS: Student;
  get selectedS() {
    return this._selectedS;
  }
  set selectedS(newS: Student) {
    if (this._selectedS.id === newS.id) {
      this._selectedS = null;
    }
    this._selectedS = newS;
  }
}
