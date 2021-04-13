import { Component, OnInit } from '@angular/core';
import { Student } from '../shared/models/Student';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  private _selectedS: Student = null;
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

  constructor() {}

  ngOnInit(): void {}
}
