import { Component, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MY_DATE_FORMATS } from './utils/custom-date-formats';
import { AppDateAdapter } from './utils/dateAdapter.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: AppDateAdapter },
  ],
})
export class FormsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
