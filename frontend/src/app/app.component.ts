import { Component } from '@angular/core';
import { Student } from './models/Student';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private _selectedS: Student = null
  get selectedS() {
    return this._selectedS;
  }
  set selectedS(newS: Student) {
    if (this._selectedS && this._selectedS.id === newS.id) {
      this._selectedS = null;
    } else {
      this._selectedS = newS;
    }
  }
}
